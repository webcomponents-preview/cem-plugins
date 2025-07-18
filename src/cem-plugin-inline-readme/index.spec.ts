import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { create, ts } from '@custom-elements-manifest/analyzer/index.js';
import { litPlugin } from '@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js';

import { customElementInlineReadmePlugin } from './index.js';

describe('cem-plugin-inline-readme', () => {
  it('should add groups to manifest', async () => {
    const path = join(__dirname, '../fixtures/button.component.ts');
    const content = await readFile(resolve(path), 'utf-8');
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true);

    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementInlineReadmePlugin({ loadReadme: () => '# Readme' })],
      context: { dev: false },
    });

    expect(manifest.modules[0].declarations[0].readme).toEqual('# Readme');
  });
});
