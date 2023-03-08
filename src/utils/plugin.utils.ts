/**
 * Type guard to check if a node has jsDoc comments.
 */
export function hasJsDocComments(node: CemNode): node is CemNodeWithJsDoc {
  return 'jsDoc' in node && (node as CemNodeWithJsDoc).jsDoc.length > 0;
}

/**
 * Delivers a specificly named declaration from a module doc.
 */
export function findDeclaration<T extends CemJSDoc = CemJSDoc>(
  moduleDoc?: CemModuleDoc,
  className?: string
): T | undefined {
  return moduleDoc?.declarations?.find(({ name }) => name === className) as unknown as T | undefined;
}
