import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#usage-in-the-browser
import { ts, create, litPlugin } from '@custom-elements-manifest/analyzer/browser/index.js';

import { customElementInlineReadmePlugin } from '.';

describe('cem-plugin-inline-readme', () => {
  it('should add groups to manifest', async () => {
    const path = join(__dirname, '../fixtures/button.component.ts');
    const content = await readFile(resolve(path), 'utf-8');
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true);
    
    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementInlineReadmePlugin({ loadReadme: () => '# Readme' })],
    });

    expect(manifest.modules[0].declarations[0].readme).toEqual('# Readme');
  });
});
