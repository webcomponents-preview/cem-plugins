declare module '@custom-elements-manifest/to-markdown' {
  import type { AnalyzePhaseParams } from '@custom-elements-manifest/analyzer';

  export interface Options {
    private: 'all' | 'details' | 'hidden';
    headingOffset: number;
    classNameFilter: string;
    omitSections: string[];
    omitDeclarations: string[];
  }
  type ModuleDoc = AnalyzePhaseParams['moduleDoc'];
  export function customElementsManifestToMarkdown(
    manifest: { modules: ModuleDoc[] },
    options?: Partial<Options>,
  ): string;
}

declare module '@custom-elements-manifest/analyzer/index.js' {
  import type { Plugin } from '@custom-elements-manifest/analyzer';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const create: (options: { modules: any[]; plugins: Plugin[]; context: { dev: boolean } }) => any;
  const ts: typeof import('typescript');

  export { create, ts };
}

declare module '@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js' {
  import type { Plugin } from '@custom-elements-manifest/analyzer';

  export const litPlugin: () => Plugin[];
}

declare module 'esbuild-copy-static-files' {
  import type { Plugin } from 'esbuild';

  export interface CopyStaticFilesOptions {
    src: string;
    dest: string;
    filter: (src: string, dest: string) => boolean;

    dereference: boolean;
    errorOnExist: boolean;
    force: boolean;
    preserveTimestamps: boolean;
    recursive: boolean;
  }
  const copyStaticFiles: (options?: Partial<CopyStaticFilesOptions>) => Plugin;
  export default copyStaticFiles;
}

declare module '@remcovaes/web-test-runner-vite-plugin' {
  import type { TestRunnerCoreConfig, TestRunnerPlugin } from '@web/test-runner-core';
  import type { UserConfig } from 'vite';

  export function vitePlugin(config?: UserConfig): TestRunnerPlugin;
  export const removeViteLogging: TestRunnerCoreConfig['filterBrowserLogs'];
}
