import { build } from 'esbuild';
import { addDeclarations } from './esbuild-plugin-add-declarations';
import { addPackageJson } from './esbuild-plugin-add-package';

build({
  sourceRoot: 'src',
  entryPoints: [
    'src/cem-plugin-examples/custom-element-examples.plugin.ts',
    'src/cem-plugin-inline-readme/custom-element-inline-readme.plugin.ts',
  ],
  // we don't mess with the default buildt output, but use the temp dir
  outdir: 'dist',
  platform: 'node',
  format: 'esm',
  bundle: true,
  metafile: true,
  minify: true,
  treeShaking: true,
  sourcemap: true,
  logLevel: 'error',
  plugins: [
    addPackageJson({
      addReadme: true,
    }),
    addDeclarations({
      addGlobalDeclarations: ['src/typings.d.ts'],
    }),
  ],
});
