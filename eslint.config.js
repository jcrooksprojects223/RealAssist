// Load ESLint's built-in JavaScript recommendations, browser globals, and React rules.
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// defineConfig gives the settings below editor/build-time validation and readable structure.
import { defineConfig, globalIgnores } from 'eslint/config'

// Export the lint rules used by this project.
export default defineConfig([
  // Do not lint compiled files; they are generated from the source code.
  globalIgnores(['dist']),
  {
    // Apply these settings only to JavaScript and JSX files.
    files: ['**/*.{js,jsx}'],
    // Combine standard JavaScript, React Hooks, and Vite React-refresh recommendations.
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    // Tell ESLint that browser APIs exist and that JSX syntax is used in these files.
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
