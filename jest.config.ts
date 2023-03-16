import type { JestConfigWithTsJest } from 'ts-jest';

// Sync object
const config: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[tj]s'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: { '^.+\\.m?[tj]sx?$': ['ts-jest', { useESM: true }] },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@custom-elements-manifest|@github|cem-plugins))'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'd.ts', 'ts', 'tsx', 'json', 'node'],
};

export default config;
