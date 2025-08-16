import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import path from 'path';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['src/**/*.{ts,vue}', 'tests/**/*.ts'],
    ignores: ['node_modules/', 'dist/', 'build/', 'src-tauri/'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        project: path.resolve('./tsconfig.json'),
        extraFileExtensions: ['.vue'],
        parser: tsParser,
      },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Vue rules
      'vue/html-indent': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',

      // Multi-word rule
      'vue/multi-word-component-names': 'off',
    },
  },
];
