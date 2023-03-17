import { build } from 'esbuild';
import glob from 'fast-glob';

import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import { addDeclarations } from './esbuild-plugin-add-declarations';
import { addPackageJson } from './esbuild-plugin-add-package';

build({
  sourceRoot: 'src',
  entryPoints: await glob('src/cem-plugin-*/index.ts'),
  // we don't mess with the default build output, but use the temp dir
  outdir: 'dist',
  platform: 'node',
  format: 'esm',
  bundle: true,
  metafile: true,
  minify: true,
  treeShaking: true,
  sourcemap: true,
  logLevel: 'error',
  banner: {
    js: `
      const require = await import('module').then($=>$.createRequire(import.meta.url));
      const __filename = await import('url').then($=>$.fileURLToPath(import.meta.url));
    `,
  },
  plugins: [
    addPackageJson({
      filter: /cem-plugin-.*\/index\.ts$/,
      addReadme: true,
      async readmeTemplate({ basePath }) {
        return await readFile(resolve('src', basePath, 'README.md'), 'utf-8');
      },
    }),
    addDeclarations({
      filter: /cem-plugin-.*\/index\.ts$/,
      include: ['src/typings.d.ts'],
    }),
  ],
});
