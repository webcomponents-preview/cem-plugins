import type { Plugin } from 'esbuild';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { cwd } from 'node:process';

import type { package as Package } from './package.d';

type ReadmeTemplateContext = {
  name: string;
  basePath: string;
  path: string;
  rootPackage: Package;
};

type PluginOptions = {
  filter: RegExp;
  packageName: string;

  addReadme: boolean;
  readmeName: string;
  readmeTemplate: (context: ReadmeTemplateContext) => string | Promise<string>;

  sourceRoot: string;
  outdir: string;
};

async function generatePackage(
  path: string,
  packageName: string,
  rootPackage: Package,
  src: string,
  dist: string
): Promise<void> {
  // resolve paths for package.json
  const baseFile = basename(path, '.ts');
  const basePath = dirname(relative(src, path));
  const baseName = basename(basePath);

  const packageDir = join(dist, basePath);
  const packagePath = join(packageDir, packageName);

  const [scope] = rootPackage.name.split('/');
  const name = scope !== undefined ? `${scope}/${baseName}` : baseName;

  // create package.json
  const packageContent = {
    name,
    main: `${baseFile}.js`,
    module: `${baseFile}.js`,
    types: `${baseFile}.d.ts`,
    files: [`${baseFile}.*`],
    repository: rootPackage.repository,
    version: rootPackage.version,
    author: rootPackage.author,
    license: rootPackage.license,
    publishConfig: rootPackage.publishConfig,
    type: rootPackage.type,
    peerDependencies: rootPackage.peerDependencies,
    engines: rootPackage.engines,
  };

  // write package.json
  if (!existsSync(packageDir)) await mkdir(packageDir, { recursive: true });
  await writeFile(packagePath, JSON.stringify(packageContent, null, 2), 'utf-8');
}

async function generateReadme(
  path: string,
  readmeName: PluginOptions['readmeName'],
  readmeTemplate: PluginOptions['readmeTemplate'],
  rootPackage: Package,
  src: string,
  dist: string
): Promise<void> {
  // resolve paths for readme
  const basePath = dirname(relative(src, path));
  const baseName = basename(basePath);

  const readmeDir = join(dist, basePath);
  const readmePath = join(readmeDir, readmeName);

  const [scope] = rootPackage.name.split('/');
  const name = scope !== undefined ? `${scope}/${baseName}` : baseName;

  // write readme
  if (!existsSync(readmeDir)) await mkdir(readmeDir, { recursive: true });
  await writeFile(readmePath, await readmeTemplate({ name, basePath, path, rootPackage }), 'utf-8');
}

export function addPackageJson(options?: Partial<PluginOptions>): Plugin {
  return {
    name: 'add package.json',
    async setup(build) {
      // receive options, fill in defaults from esbuild, set fallbacks
      const {
        filter = /\.ts$/,
        packageName = 'package.json',
        addReadme = false,
        readmeName = 'README.md',
        readmeTemplate = ({ name }) => `# ${name}`,
        outdir = build.initialOptions.outdir ?? 'dist',
        sourceRoot = build.initialOptions.sourceRoot ?? 'src',
      } = options || {};

      // derive paths
      const src = resolve(sourceRoot);
      const dist = resolve(outdir);

      // load root package
      const rootPackage = JSON.parse(await readFile(resolve(cwd(), 'package.json'), 'utf-8'));

      // intercept plugins that are resolved
      build.onLoad({ filter }, async ({ path }) => {
        // add package.json
        await generatePackage(path, packageName, rootPackage, src, dist);

        // add readme
        if (addReadme) {
          await generateReadme(path, readmeName, readmeTemplate, rootPackage, src, dist);
        }

        // go on as usual
        return undefined;
      });
    },
  };
}
