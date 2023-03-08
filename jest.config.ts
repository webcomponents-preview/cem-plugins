import type { JestConfigWithTsJest } from 'ts-jest';

// Sync object
const config: JestConfigWithTsJest = {
  globals: {
    configuration: {},
    Liferay: {},
  },
  preset: 'ts-jest/presets/js-with-ts',
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: { '^.+\\.m?[tj]s$': 'ts-jest' },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'd.ts', 'ts', 'tsx', 'json', 'node'],
};

export default config;
