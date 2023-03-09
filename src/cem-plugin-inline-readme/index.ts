import type { Plugin } from '@custom-elements-manifest/analyzer';
import { findDeclaration } from '../utils/plugin.utils';

// as the plugin is create by factory function, we can provide some options
type PluginOptions = {
  /**
   * Provide a function that loads the readme for a given module path.
   */
  loadReadme(componentPath?: string): string;
};

/**
 * A plugin for `@custom-elements-manifest/analyzer` that can be used to provide an additional `readme` property
 * to a module's documentation. This is useful if you want to load the contents from a components README.md file.
 */
export function customElementInlineReadmePlugin({ loadReadme }: PluginOptions): Plugin {
  return {
    name: 'custom-element-readme',
    analyzePhase({ ts, node, moduleDoc }) {
      // we just look up docs for classes
      if (ts.isClassDeclaration(node)) {
        const doc = findDeclaration<CemJSDoc & { readme: string }>(moduleDoc, node.name?.getText());
        if (!doc) return;
        doc.readme = loadReadme(moduleDoc.path);
      }
    },
  };
}
