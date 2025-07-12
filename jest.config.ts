import type { JestConfigWithTsJest } from 'ts-jest';
import { createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset({ tsconfig: 'tsconfig.json' });
const jestConfig: JestConfigWithTsJest = {
  ...esmPreset,
  // Typescript imports as `*.js` must be mapped manually
  // https://github.com/swc-project/jest/issues/64
  // https://stackoverflow.com/a/75833026/1146207
  moduleNameMapper: { '^(\\.\\.?\\/.+)\\.js$': '$1' },
  // Somehow we need to specify the transform for ESM files
  transform: { '^.+\\.m?[tj]sx?$': ['ts-jest', { useESM: true }] },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(@custom-elements-manifest|@github|cem-plugins))'],
};

export default jestConfig;
