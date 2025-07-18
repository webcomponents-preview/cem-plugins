import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Plugin } from '@custom-elements-manifest/analyzer';
import type { Options as CemOptions } from '@custom-elements-manifest/to-markdown';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';
import { analyzeText, transformAnalyzerResult } from 'web-component-analyzer';

import { findDeclaration } from '../utils/plugin.utils.js';

// as the plugin is create by factory function, we can provide some options
type PluginOptions = {
  /**
   * Provide a function that provides a path to store the readme file to.
   */
  outputPath(componentPath?: string): string;

  /**
   * Like the `@webcomponents-preview/cem-plugin-inline-readme` plugin, we can
   * additionally add the generated readme as `readme` property to the manifest.
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

export const GENERATOR_COMMENT = '<!-- Auto Generated Below -->';

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
        // find the declaration in the module doc
        const doc = findDeclaration<CemJSDoc & { readme: string }>(moduleDoc, node.name?.getText());
        if (!doc) return;

        // request the output path, prepare the directory if necessary and read eventually existing readme
        const readmePath = resolve(outputPath(moduleDoc.path));
        mkdirSync(dirname(readmePath), { recursive: true });
        const existing = existsSync(readmePath) ? readFileSync(readmePath, 'utf-8') : '';

        // we use the markdown transformer to generate the markdown
        let markdown: string;
        if (transformer === 'cem') {
          markdown = customElementsManifestToMarkdown({ modules: [moduleDoc] }, options.transformerOptions);
        } else {
          const { program, results } = analyzeText(node.getSourceFile().getText());
          markdown = transformAnalyzerResult('markdown', results, program);
        }

        // if there is already a readme, we add the markdown below the comment
        let readme: string;
        if (existing.includes(GENERATOR_COMMENT)) {
          const [before] = existing.split(GENERATOR_COMMENT);
          readme = `${before}${GENERATOR_COMMENT}\n\n${markdown}`;
        } else {
          readme = `${GENERATOR_COMMENT}\n\n${markdown}`;
        }

        // align line endings to LF
        readme = readme.replace(/\r\n/g, '\n');

        // add readme inline to manifest
        if (options.addInlineReadme) {
          doc.readme = readme;
        }

        // write the result
        writeFileSync(readmePath, readme);
      }
    },
  };
}
