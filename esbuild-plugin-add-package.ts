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
  readmeTemplate: (name: string, rootPackage: any) => string;

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
  const baseFile = basename(path, '.ts');
  const basePath = dirname(relative(src, path));
  const baseName = basename(basePath);

  const packageDir = join(dist, basePath);
  const packagePath = join(packageDir, packageName);

  const [scope] = rootContent.name.split('/');
  const name = scope !== undefined ? `${scope}/${baseName}` : baseName;

  // create package.json
  const packageContent = {
    name,
    main: `${baseFile}.js`,
    module: `${baseFile}.js`,
    types: `${baseFile}.d.ts`,
    files: [`${baseFile}.*`],
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
  readmeName: PluginOptions['readmeName'],
  readmeTemplate: PluginOptions['readmeTemplate'],
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

  // write readme
  if (!existsSync(readmeDir)) await mkdir(readmeDir, { recursive: true });
  await writeFile(readmePath, readmeTemplate(name, rootContent), 'utf-8');
}

export function addPackageJson(options?: Partial<PluginOptions>): Plugin {
  return {
    name: 'add package.json',
    async setup(build) {
      // receive options, fill in defaults from esbuild, set fallbacks
      const {
        filter = /\.ts$/,
        packageName = 'package.json',
        rootPackage = resolve(cwd(), 'package.json'),
        addReadme = false,
        readmeName = 'README.md',
        readmeTemplate = (name: string) => `# ${name}`,
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
          await generateReadme(path, readmeName, readmeTemplate, rootContent, src, dist);
        }

        // go on as usual
        return undefined;
      });
    },
  };
}
