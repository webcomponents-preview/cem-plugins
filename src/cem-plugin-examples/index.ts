import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Plugin } from '@custom-elements-manifest/analyzer';

import { findDeclaration, hasJsDocComments } from '../utils/plugin.utils.js';

// as the plugin is create by factory function, we can provide some options
interface PluginOptions {
  // the markdown file name to look for
  exampleFileName?: string;
}

function isExampleTag(tag: CemJsDocTag): boolean {
  return tag.tagName.escapedText === 'example';
}

/**
 * Plugin for `@custom-elements-manifest/analyzer` that adds code examples to the manifest that
 * are either annotated with the `@example` tag or accompanied by a `example.md` markdown file.
 *
 * So each module with annotated or file based examples will receive an additional `examples`
 * property containing them as strings.
 */

export function customElementExamplesPlugin(options?: Partial<PluginOptions>): Plugin {
  return {
    name: 'custom-element-examples',
    analyzePhase({ ts, node, moduleDoc }) {
      // must be a class declaration
      if (!ts.isClassDeclaration(node)) return;

      // read the document of the module
      const doc = findDeclaration<CemJSDoc & { examples: string[] }>(moduleDoc, node.name?.getText());
      if (!doc) return;

      // look up for docs of classes
      if (hasJsDocComments(node)) {
        doc.examples = node.jsDoc.reduce((all, doc) => {
          const tags = doc.tags?.filter(isExampleTag);
          return [...all, ...((tags?.map((tag) => tag.comment || '') || []) as string[])];
        }, doc.examples ?? []);
      }

      // check for markdown files and add them as example
      const sourceFolder = dirname(node.getSourceFile().fileName);
      const examplesFile = resolve(sourceFolder, options?.exampleFileName || 'EXAMPLES.md');
      if (existsSync(examplesFile)) {
        doc.examples = [...(doc.examples ?? []), readFileSync(examplesFile, 'utf-8')];
      }
    },
  };
}
