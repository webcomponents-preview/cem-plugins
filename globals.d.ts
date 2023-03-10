import type { Plugin } from 'esbuild';

declare module 'esbuild-copy-static-files' {
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

declare global {
  const fetch: typeof import('node-fetch').default;
}
