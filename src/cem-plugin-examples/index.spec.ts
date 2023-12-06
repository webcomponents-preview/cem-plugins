import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { SourceFile } from 'typescript';

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#usage-in-the-browser
import { ts, create, litPlugin } from '@custom-elements-manifest/analyzer/browser/index.js';

import { customElementExamplesPlugin } from '.';

describe('cem-plugin-examples', () => {
  let source: SourceFile;

  beforeAll(async () => {
    const path = join(__dirname, '../fixtures/button.component.ts');
    const content = await readFile(resolve(path), 'utf-8');
    source = ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true);
  });

  it('should read examples from annotation', () => {
    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementExamplesPlugin()],
    });

    expect(manifest.modules[0].declarations[0].examples[0]).toMatch(/^# Example 1/);
  });

  it('should read examples from markdown', () => {
    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementExamplesPlugin()],
    });

    expect(manifest.modules[0].declarations[0].examples[1]).toMatch(/^# Example 2/);
  });
});
