import type { AnalyzePhaseParams } from '@custom-elements-manifest/analyzer';

declare global {
  // CEM uses a specific version of typescript which will most likely not match ours.
  type CemJSDoc = import('@custom-elements-manifest/analyzer/node_modules/typescript').JSDoc;
  type CemJsDocTag = import('@custom-elements-manifest/analyzer/node_modules/typescript').JSDocTag;

  type CemModuleDoc = AnalyzePhaseParams['moduleDoc'];
  type CemNode = AnalyzePhaseParams['node'];
  type CemNodeWithJsDoc = CemNode & { jsDoc: CemJSDoc[] };
}
