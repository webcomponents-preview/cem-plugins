import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#usage-in-the-browser
import { ts, create, litPlugin } from '@custom-elements-manifest/analyzer/browser/index.js';

import { customElementGroupingPlugin } from '.';

describe('cem-plugin-grouping', () => {
  it('should add groups to manifest', async () => {
    const path = join(__dirname, '../fixtures/button.component.ts');
    const content = await readFile(resolve(path), 'utf-8');
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true);

    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementGroupingPlugin({ addGroups: () => ['foo'] })],
      context: { dev: false },
    });

    expect(manifest.modules[0].declarations[0].groups).toEqual(['foo']);
  });
});
