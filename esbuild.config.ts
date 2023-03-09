import { build } from 'esbuild';
import { addDeclarations } from './esbuild-plugin-add-declarations';
import { addPackageJson } from './esbuild-plugin-add-package';

build({
  sourceRoot: 'src',
  entryPoints: ['src/cem-plugin-examples/index.ts', 'src/cem-plugin-inline-readme/index.ts'],
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
      filter: /cem-plugin-.*\/index\.ts$/,
      addReadme: true,
      readmeTemplate(name: string, rootContent: any) {
        const repository = rootContent.repository?.url ?? `https://github.com/${rootContent.repository}`;
        return `# <img align="left" src="https://github.com/webcomponents-preview/client/raw/main/src/assets/icons/logo.svg" alt="WCP Logo" height="43px"> ${name}\n\ns. [${rootContent.name}](${repository})\n`;
      },
    }),
    addDeclarations({
      filter: /cem-plugin-.*\/index\.ts$/,
      include: ['src/typings.d.ts'],
    }),
  ],
});
