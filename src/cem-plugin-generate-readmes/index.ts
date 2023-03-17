import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Plugin } from '@custom-elements-manifest/analyzer';
import { type Options as CemOptions, customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';
import { analyzeText, transformAnalyzerResult } from 'web-component-analyzer';

import { findDeclaration } from '../utils/plugin.utils';

// as the plugin is create by factory function, we can provide some options
type PluginOptions = {
  /**
   * Provide a function that provides a path to store the readme file to.
   */
  outputPath(componentPath?: string): string;
  /**
   * Like the `@webcomponents-preview/cem-plugin-inline-readme` plugin, we can
   * additional add the generated readme as `readme` property to the manifest.
   */
  addInlineReadme?: boolean;
} & (
  | {
      transformer: 'cem';
      transformerOptions?: Partial<CemOptions>;
    }
  | {
      transformer: 'wca';
    }
);

/**
 * A plugin for `@custom-elements-manifest/analyzer` that can be used to generate README.md files.
 */
export function customElementGenerateReadmesPlugin(options: PluginOptions): Plugin {
  const { outputPath, transformer } = options;
  return {
    name: 'custom-element-generate-readmes',
    analyzePhase({ ts, node, moduleDoc }) {
      // we just look up docs for classes
      if (ts.isClassDeclaration(node)) {
        const doc = findDeclaration<CemJSDoc & { readme: string }>(moduleDoc, node.name?.getText());
        if (!doc) return;
        // request the output path
        const readmePath = resolve(outputPath(moduleDoc.path));
        // we use the markdown transformer to generate the markdown
        let markdown: string;
        if (transformer === 'cem') {
          markdown = customElementsManifestToMarkdown({ modules: [moduleDoc] }, options.transformerOptions);
        } else {
          const { program, results } = analyzeText(node.getSourceFile().getText());
          markdown = transformAnalyzerResult('markdown', results, program);
        }
        // add inline readme
        if (options.addInlineReadme) {
          doc.readme = markdown;
        }
        // write the result
        mkdirSync(dirname(readmePath), { recursive: true });
        writeFileSync(readmePath, markdown);
      }
    },
  };
}
