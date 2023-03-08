import type { Plugin } from 'esbuild';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { cwd } from 'node:process';

type PluginOptions = {
  filter: RegExp;
  packageName: string;
  rootPackage: string;

  addReadme: boolean;
  readmeName: string;

  sourceRoot: string;
  outdir: string;
};

async function generatePackage(
  path: string,
  packageName: string,
  rootContent: any,
  src: string,
  dist: string
): Promise<void> {
  // resolve paths for package.json
  const baseFile = basename(path);
  const basePath = dirname(relative(src, path));
  const baseName = basename(basePath);

  const packageDir = join(dist, basePath);
  const packagePath = join(packageDir, packageName);

  const [scope] = rootContent.name.split('/');
  const name = scope !== undefined ? `${scope}/${baseName}` : baseName;

  // create package.json
  const packageContent = {
    name,
    main: baseFile.replace(/\.ts$/, '.js'),
    module: baseFile.replace(/\.ts$/, '.js'),
    types: baseFile.replace(/\.ts$/, '.d.ts'),
    files: [baseFile],
    repository: rootContent.repository,
    version: rootContent.version,
    author: rootContent.author,
    license: rootContent.license,
    publishConfig: rootContent.publishConfig,
    type: rootContent.type,
    peerDependencies: rootContent.peerDependencies,
    engines: rootContent.engines,
  };

  // write package.json
  if (!existsSync(packageDir)) await mkdir(packageDir, { recursive: true });
  await writeFile(packagePath, JSON.stringify(packageContent, null, 2), 'utf-8');
}

async function generateReadme(
  path: string,
  readmeName: string,
  rootContent: any,
  src: string,
  dist: string
): Promise<void> {
  // resolve paths for readme
  const basePath = dirname(relative(src, path));
  const baseName = basename(basePath);

  const readmeDir = join(dist, basePath);
  const readmePath = join(readmeDir, readmeName);
  
  const [scope] = rootContent.name.split('/');
  const name = scope !== undefined ? `${scope}/${baseName}` : baseName;

  // create readme and write it
  const repository = rootContent.repository?.url ?? `https://github.com/${rootContent.repository}`;
  const readmeContent = `# ${name}\n\ns. [${rootContent.name}](${repository})\n`;

  // write readme
  if (!existsSync(readmeDir)) await mkdir(readmeDir, { recursive: true });
  await writeFile(readmePath, readmeContent, 'utf-8');
}

export function addPackageJson(options?: Partial<PluginOptions>): Plugin {
  return {
    name: 'add package.json',
    async setup(build) {
      // receive options, fill in defaults from esbuild, set fallbacks
      const {
        filter = /\.plugin\.ts$/,
        packageName = 'package.json',
        rootPackage = resolve(cwd(), 'package.json'),
        addReadme = false,
        readmeName = 'README.md',
        outdir = build.initialOptions.outdir ?? 'dist',
        sourceRoot = build.initialOptions.sourceRoot ?? 'src',
      } = options || {};

      // derive paths
      const src = resolve(sourceRoot);
      const dist = resolve(outdir);

      // load root package
      const rootContent = JSON.parse(await readFile(rootPackage, 'utf-8'));

      // intercept plugins that are resolved
      build.onLoad({ filter }, async ({ path }) => {
        // add package.json
        await generatePackage(path, packageName, rootContent, src, dist);

        // add readme
        if (addReadme) {
          await generateReadme(path, readmeName, rootContent, src, dist);
        }

        // go on as usual
        return undefined;
      });
    },
  };
}
