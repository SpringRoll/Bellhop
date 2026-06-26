import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'],
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
  }
];
