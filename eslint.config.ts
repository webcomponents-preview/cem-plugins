import config from '@enke.dev/lint';
import type { Linter } from 'eslint';

export default [
  ...config,
  {
    ignores: ['dist', 'reports', 'node_modules', 'package.d.ts'],
  },
] satisfies Linter.Config[];
