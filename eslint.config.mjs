import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.spec.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      'semi': ['error', 'always'],
      'quotes': [2, 'single'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'no-console': 0
    }
  },
  {
    files: ['src/**/*.spec.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: './tsconfig.test.json' }
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      'semi': ['error', 'always'],
      'quotes': [2, 'single'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'no-console': 0,
      // Chai BDD assertions like `.to.be.true` are getter-based side effects
      // that ESLint incorrectly flags as unused expressions
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
];
