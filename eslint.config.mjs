import { createRequire } from 'node:module';

const rootRequire = createRequire(import.meta.url);
const eslintRequire = createRequire(rootRequire.resolve('eslint/package.json'));
const { FlatCompat } = eslintRequire('@eslint/eslintrc');

const compat = new FlatCompat({ baseDirectory: process.cwd() });

export default [
  // Use compat to load shareable configs (like `next/core-web-vitals`) in flat format
  ...compat.extends('next/core-web-vitals'),
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];
