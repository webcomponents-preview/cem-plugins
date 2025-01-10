import { existsSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { SourceFile } from 'typescript';

// https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#usage-in-the-browser
import { ts, create, litPlugin } from '@custom-elements-manifest/analyzer/browser/index.js';

import { customElementGenerateReadmesPlugin } from '.';

describe('cem-plugin-generate-readmes', () => {
  const target = join(__dirname, '.README.md');
  let source: SourceFile;

  beforeAll(async () => {
    const path = join(__dirname, '../fixtures/button.component.ts');
    const content = await readFile(resolve(path), 'utf-8');
    source = ts.createSourceFile(path, content, ts.ScriptTarget.ES2015, true);
  });

  afterEach(async () => existsSync(target) && (await rm(target)));

  describe.each`
    transformer | name
    ${'cem'}    | ${'@custom-elements-manifest/analyzer'}
    ${'wca'}    | ${'web-component-analyzer'}
  `('using $name', ({ transformer }) => {
    it('should render', () => {
      const manifest = create({
        modules: [source],
        plugins: [...litPlugin(), customElementGenerateReadmesPlugin({ transformer, outputPath: () => target })],
        context: { dev: false },
      });

      expect(manifest).toBeDefined();
      expect(existsSync(target)).toBe(true);
    });

    it('should not use carriage returns', async () => {
      await writeFile(target, '# Test\r\n\r\n<!-- Auto Generated Below -->\r\n\r\n');
      create({
        modules: [source],
        plugins: [...litPlugin(), customElementGenerateReadmesPlugin({ transformer, outputPath: () => target })],
        context: { dev: false },
      });

      const readme = await readFile(target, 'utf-8');
      expect(readme).not.toContain('\r');
    });

    it('should add markdown to existing readmes', async () => {
      await writeFile(target, '# Test\n\n<!-- Auto Generated Below -->\n\n');
      create({
        modules: [source],
        plugins: [...litPlugin(), customElementGenerateReadmesPlugin({ transformer, outputPath: () => target })],
        context: { dev: false },
      });

      const readme = await readFile(target, 'utf-8');
      expect(readme).toContain('# Test\n\n<!-- Auto Generated Below -->');
    });

    it('should replace markdown if comment is missing', async () => {
      await writeFile(target, '# Test\n\n');
      create({
        modules: [source],
        plugins: [...litPlugin(), customElementGenerateReadmesPlugin({ transformer, outputPath: () => target })],
        context: { dev: false },
      });

      const readme = await readFile(target, 'utf-8');
      expect(readme).not.toContain('# Test\n\n<!-- Auto Generated Below -->');
    });
  });
});
