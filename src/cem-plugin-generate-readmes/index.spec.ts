import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#usage-in-the-browser
import { ts, create, litPlugin } from '@custom-elements-manifest/analyzer/browser/index.js';

import { customElementGenerateReadmesPlugin } from '.';

describe('cem-plugin-generate-readmes', () => {
  const target = join(__dirname, '.README.md');
  const source = ts.createSourceFile(
    join(__dirname, '../fixtures/button.component.ts'),
    readFileSync(resolve(__dirname, '../fixtures/button.component.ts')).toString(),
    ts.ScriptTarget.ES2015,
    true
  );

  afterEach(() => existsSync(target) && rmSync(target));

  it('should render using `@custom-elements-manifest/analyzer`', () => {
    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementGenerateReadmesPlugin({ transformer: 'cem', outputPath: () => target })],
    });

    expect(manifest).toBeDefined();
    expect(existsSync(target)).toBe(true);
  });

  it('should render using `web-component-analyzer`', () => {
    const manifest = create({
      modules: [source],
      plugins: [...litPlugin(), customElementGenerateReadmesPlugin({ transformer: 'wca', outputPath: () => target })],
    });

    expect(manifest).toBeDefined();
    expect(existsSync(target)).toBe(true);
  });
});
