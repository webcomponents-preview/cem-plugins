declare module '@custom-elements-manifest/to-markdown' {
  import type { AnalyzePhaseParams } from '@custom-elements-manifest/analyzer';
  export type Options = {
    private: 'all' | 'details' | 'hidden';
    headingOffset: number;
    classNameFilter: string;
    omitSections: string[];
    omitDeclarations: string[];
  };
  type ModuleDoc = AnalyzePhaseParams['moduleDoc'];
  export function customElementsManifestToMarkdown(
    manifest: { modules: ModuleDoc[] },
    options?: Partial<Options>
  ): string;
}

declare module '@custom-elements-manifest/analyzer/browser/index.js' {
  import type { Plugin } from '@custom-elements-manifest/analyzer';
  const create: (options: { modules: any[]; plugins: Plugin[] }) => any;
  const ts: typeof import('typescript');
  const litPlugin: () => Plugin[];
  export { create, ts, litPlugin };
}

declare module 'esbuild-copy-static-files' {
  import type { Plugin } from 'esbuild';
  export type CopyStaticFilesOptions = {
    src: string;
    dest: string;
    filter: (src: string, dest: string) => boolean;

    dereference: boolean;
    errorOnExist: boolean;
    force: boolean;
    preserveTimestamps: boolean;
    recursive: boolean;
  };
  const copyStaticFiles: (options?: Partial<CopyStaticFilesOptions>) => Plugin;
  export default copyStaticFiles;
}
