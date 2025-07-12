import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#usage-in-the-browser
import { create, litPlugin, ts } from '@custom-elements-manifest/analyzer/browser/index.js';
import type { SourceFile } from 'typescript';

import { customElementExamplesPlugin } from './index.js';

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
      context: { dev: false },
    });

    expect(manifest.modules[0].declarations[0].examples[0]).toMatch(/^# Example 1/);
  });

  it('should read examples from markdown', () => {
    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementExamplesPlugin()],
      context: { dev: false },
    });

    expect(manifest.modules[0].declarations[0].examples[1]).toMatch(/^# Example 2/);
  });
});
