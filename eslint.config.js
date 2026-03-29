import js from "@eslint/js";
import globals from "globals";

import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

import tsParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // --------------------------------------------
  // Base (JS recommended)
  // --------------------------------------------
  js.configs.recommended,

  // --------------------------------------------
  // App: JS/JSX/TS/TSX 共通
  // --------------------------------------------
  {
   files: ["**/*.{js,jsx,ts,tsx}"],
   languageOptions: {
     ecmaVersion: "latest",
     sourceType: "module",
     parserOptions: {
       ecmaFeatures: { jsx: true },
     },
     globals: {
       ...globals.browser,
       ...globals.es2021,
     },
   },
   settings: {
     react: { version: "detect" },
     formComponents: ["Form"],
     linkComponents: [
       { name: "Link", linkAttribute: "to" },
       { name: "NavLink", linkAttribute: "to" },
     ],
     "import/resolver": {
       typescript: {},
     },
   },
   plugins: {
     react: reactPlugin,
     "react-hooks": reactHooksPlugin,
     "jsx-a11y": jsxA11yPlugin,
     import: importPlugin,
     "@typescript-eslint": typescriptPlugin,
   },
   rules: {
     // React / A11y / Hooks
     ...reactPlugin.configs.recommended.rules,
     ...reactHooksPlugin.configs.recommended.rules,
     ...jsxA11yPlugin.configs.recommended.rules,

     // React 17+ (new JSX transform)
     "react/react-in-jsx-scope": "off",

     // NOTE:
     // JS側では no-unused-vars を使う（TS側は @typescript-eslint/no-unused-vars に寄せる）
     "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

     // import plugin recommended
     ...importPlugin.configs.recommended.rules,
   },
  },

  // --------------------------------------------
  // TypeScript: TS/TSX only
  //  - TS parser を使う
  //  - TSでは no-undef は誤検出源なので OFF
  // --------------------------------------------
  {
   files: ["**/*.{ts,tsx}"],
   languageOptions: {
     parser: tsParser,
     ecmaVersion: "latest",
     sourceType: "module",
     parserOptions: {
       ecmaFeatures: { jsx: true },
     },
     globals: {
       ...globals.browser,
       ...globals.es2021,
     },
   },
   settings: {
     "import/internal-regex": "^~/",
     "import/resolver": {
       // ★ exports / subpath を解決させたいので node を明示
       node: {
         extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
       },
       // ★ tsconfig paths などのために typescript も残す
       typescript: {
         project: "./tsconfig.json",
         alwaysTryTypes: true,
       },
     },
   },

   rules: {
     "no-undef": "off",
     ...typescriptPlugin.configs.recommended.rules,

     "no-unused-vars": "off",
     "@typescript-eslint/no-unused-vars": [
       "warn",
       { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
     ],

     // ★ これを追加
     "import/no-unresolved": ["error", { ignore: ["^@react-router/dev/"] }],

     ...importPlugin.configs.typescript.rules,
   },
  },

  // --------------------------------------------
  // Node / CommonJS config files (if any)
  // --------------------------------------------
  {
   files: [".eslintrc.cjs", "*.config.cjs"],
   languageOptions: {
     sourceType: "commonjs",
     globals: {
       ...globals.node,
     },
   },
  },

  // --------------------------------------------
  // Tests (Vitest)
  // --------------------------------------------
  {
   files: ["**/*.test.{js,jsx,ts,tsx}", "**/tests/**/*.{js,jsx,ts,tsx}"],
   languageOptions: {
     globals: {
       ...globals.browser,
       ...globals.node,
       ...globals.vitest,
     },
   },
   rules: {
     "no-undef": "off",
   },
  },
];
