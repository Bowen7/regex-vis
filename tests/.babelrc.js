module.exports = {
  presets: [
    "@babel/env",
    [
      "@babel/react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/typescript",
  ],
  plugins: ["styled-jsx/babel-test"],
}
