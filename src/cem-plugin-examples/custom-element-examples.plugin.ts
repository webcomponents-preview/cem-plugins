#!/usr/bin/env ts-node

import type { Plugin } from '@custom-elements-manifest/analyzer';
import { findDeclaration, hasJsDocComments } from '../utils/plugin.utils';

// as the plugin is create by factory function, we can provide some options
type PluginOptions = never;

function isExampleTag(tag: CemJsDocTag): boolean {
  return tag.tagName.escapedText === 'example';
}

/**
 * Plugin for `@custom-elements-manifest/analyzer` that adds code examples
 * annotated with the `@example` tag to the manifest. So each module containing
 * class declarations with examples will receive an additional `examples`
 * property containing them as strings.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function customElementExamplesPlugin(_?: Partial<PluginOptions>): Plugin {
  return {
    name: 'custom-element-examples',
    analyzePhase({ ts, node, moduleDoc }) {
      // if no docs are given, exit (through the gift shop)
      if (!hasJsDocComments(node)) return;

      // we just look up docs for classes
      if (ts.isClassDeclaration(node)) {
        // add example tags to the documenation
        const doc = findDeclaration<CemJSDoc & { examples: string[] }>(moduleDoc, node.name?.getText());
        if (!doc) return;
        doc.examples = node.jsDoc.reduce((all, doc) => {
          const tags = doc.tags?.filter(isExampleTag);
          return [...all, ...((tags?.map((tag) => tag.comment || '') || []) as string[])];
        }, [] as string[]);
      }
    },
  };
}
