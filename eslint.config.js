// Import base ESLint config for JavaScript
import js from '@eslint/js'
// Import global variables for browser environments
import globals from 'globals'
// Import React Hooks ESLint plugin for enforcing hooks rules
import reactHooks from 'eslint-plugin-react-hooks'
// Import React Refresh plugin for fast refresh support in development
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignore the 'dist' directory from linting
  { ignores: ['dist'] },
  {
    // Apply these settings to all JS and JSX files
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // Support modern ECMAScript features
      globals: globals.browser, // Use browser global variables (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest', // Parse the latest ECMAScript syntax
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Use ES modules
      },
    },
    plugins: {
      'react-hooks': reactHooks, // Enforce React Hooks rules
      'react-refresh': reactRefresh, // Support React Fast Refresh
    },
    rules: {
      ...js.configs.recommended.rules, // Use recommended JS rules
      ...reactHooks.configs.recommended.rules, // Use recommended React Hooks rules
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Ignore unused vars that start with uppercase or underscore
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Warn if non-component exports are present (for Fast Refresh)
      ],
    },
  },
]