import type { Plugin } from 'esbuild';
import type { Program } from 'typescript';
import ts from 'typescript';

import { dirname, join, relative, resolve } from 'node:path';

type PluginOptions = {
  filter: RegExp;
  include: string[];
  sourceRoot: string;
  outdir: string;
};

function reportDiagnostics(program: Program): string {
  return ts.formatDiagnostics(ts.getPreEmitDiagnostics(program), {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getCanonicalFileName: (f) => f,
    getNewLine: () => '\n',
  });
}

async function generateDeclarations(path: string, include: string[], src: string, dist: string): Promise<void> {
  // resolve paths for package.json
  const basePath = dirname(relative(src, path));
  const declarationDir = join(dist, basePath);
  const rootDir = dirname(path);

  // generate declarations
  const program = ts.createProgram([path, ...include], {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: declarationDir,
    rootDir,
  });
  const source = program.getSourceFile(path);
  const result = program.emit(source);

  // check for errors
  if (result.emitSkipped) {
    console.error(reportDiagnostics(program));
    return Promise.reject();
  }
}

export function addDeclarations(options?: Partial<PluginOptions>): Plugin {
  return {
    name: 'add declarations',
    async setup(build) {
      // receive options, fill in defaults from esbuild, set fallbacks
      const {
        filter = /\.ts$/,
        include = [],
        outdir = build.initialOptions.outdir ?? 'dist',
        sourceRoot = build.initialOptions.sourceRoot ?? 'src',
      } = options || {};

      // derive paths
      const src = resolve(sourceRoot);
      const dist = resolve(outdir);

      // intercept plugins that are resolved
      build.onLoad({ filter }, async ({ path }) => {
        // add package.json to all targets
        await generateDeclarations(path, include, src, dist);

        // go on as usual
        return undefined;
      });
    },
  };
}
