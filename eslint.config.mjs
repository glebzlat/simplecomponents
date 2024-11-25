import pluginVue from 'eslint-plugin-vue';
import pluginSecurity from 'eslint-plugin-security';
import js from '@eslint/js';
import globals from 'globals';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const gitignorePath = path.resolve(dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  pluginSecurity.configs['recommended'],
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-use-before-define': 'error',
      'no-var': 'error',
      'semi': [ 'error', 'always', { 'omitLastInOneLineBlock': true } ],
      'quotes': [ 'error', 'single', { 'allowTemplateLiterals': true } ],
      'no-trailing-spaces': 'error',
      'comma-dangle': 'error',
      'security/detect-object-injection': 'off'
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser
      }
    }
  }
];
