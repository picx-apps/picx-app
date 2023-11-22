/** @type {import("prettier").Config} */
const config = {
  arrowParens: "always",
  printWidth: 120,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
};

export default config;
