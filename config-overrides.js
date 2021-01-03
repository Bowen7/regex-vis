const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@modules": path.resolve(__dirname, "src/modules"),
    "@parser": path.resolve(__dirname, "src/parser"),
    "@types": path.resolve(__dirname, "src/types.ts"),
    "@components": path.resolve(__dirname, "src/components"),
    "@assets": path.resolve(__dirname, "src/assets"),
    "@": path.resolve(__dirname, "src"),
  })
);
