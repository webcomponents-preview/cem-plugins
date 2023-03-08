import type { Plugin } from 'esbuild';
import type { Program } from 'typescript';
import ts from 'typescript';
import { appendFile, readFile } from 'node:fs/promises';

import { basename, dirname, join, relative, resolve } from 'node:path';

type PluginOptions = {
  filter: RegExp;
  sourceRoot: string;
  outdir: string;
  addGlobalDeclarations?: string[];
};

function reportDiagnostics(program: Program): string {
  return ts.formatDiagnostics(ts.getPreEmitDiagnostics(program), {
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getCanonicalFileName: (f) => f,
    getNewLine: () => '\n',
  });
}

async function generateDeclarations(path: string, addFrom: string[], src: string, dist: string): Promise<void> {
  // resolve paths for package.json
  const baseFile = basename(path, '.ts');
  const basePath = dirname(relative(src, path));
  const declarationName = `${baseFile}.d.ts`;
  const declarationDir = join(dist, basePath);
  const declarationPath = join(declarationDir, declarationName);
  const rootDir = dirname(path);

  // generate declarations
  const program = ts.createProgram([path, ...addFrom], {
    declaration: true,
    emitDeclarationOnly: true,
    outFile: declarationPath,
    rootDir,
  });
  const result = program.emit();

  return new Promise<void>(async (resolve, reject) => {
    // check for errors
    if (result.emitSkipped) {
      console.error(reportDiagnostics(program));
      return reject();
    }

    // add global declarations
    await Promise.allSettled(
      addFrom
        .filter((path) => path.endsWith('.d.ts'))
        .map(async (path) => {
          const appendContent = await readFile(path, 'utf-8');
          await appendFile(declarationPath, appendContent);
        })
    );

    // done
    resolve();
  });
}

export function addDeclarations(options?: Partial<PluginOptions>): Plugin {
  return {
    name: 'add declarations',
    async setup(build) {
      // receive options, fill in defaults from esbuild, set fallbacks
      const {
        filter = /\.plugin\.ts$/,
        addGlobalDeclarations = [],
        outdir = build.initialOptions.outdir ?? 'dist',
        sourceRoot = build.initialOptions.sourceRoot ?? 'src',
      } = options || {};

      // derive paths
      const src = resolve(sourceRoot);
      const dist = resolve(outdir);

      // intercept plugins that are resolved
      build.onLoad({ filter }, async ({ path }) => {
        // add package.json to all targets
        await generateDeclarations(path, addGlobalDeclarations, src, dist);

        // go on as usual
        return undefined;
      });
    },
  };
}
