import type { Plugin } from '@custom-elements-manifest/analyzer';
import { findDeclaration } from '../utils/plugin.utils';

// as the plugin is create by factory function, we can provide some options
type PluginOptions = {
  /**
   * Provide a function that delivers the groups for the given component path.
   * Multiple groups allow showing the same component in multiple places in the navigation.
   * The group can have subgroups if provided as path separated by `/`.
   */
  addGroups(componentPath?: string): string[];
};

/**
 * A plugin for `@custom-elements-manifest/analyzer` that can be used to provide an additional `groups` property
 * to a module's documentation. This can then be used by the WCP to group the navigation accordingly.
 */
export function customElementGroupingPlugin({ addGroups }: PluginOptions): Plugin {
  return {
    name: 'custom-element-grouping',
    analyzePhase({ ts, node, moduleDoc }) {
      // we just look up docs for classes
      if (ts.isClassDeclaration(node)) {
        const doc = findDeclaration<CemJSDoc & { groups: string[] }>(moduleDoc, node.name?.getText());
        if (!doc) return;
        doc.groups = addGroups(moduleDoc.path) ?? [];
      }
    },
  };
}
