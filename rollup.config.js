import replace from "@rollup/plugin-replace"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import alias from "@rollup/plugin-alias"
import path from "path"

const extensions = [".js", ".ts", ".tsx"]

export default {
  input: "./src/modules/railroad/index.tsx",
  output: {
    file: "dest/index.js",
    format: "cjs",
  },
  external: (id) => /^react|react-dom|styled-jsx|canvas/.test(id),
  plugins: [
    replace({
      "process.env.EXPORT": JSON.stringify(true),
    }),
    resolve({
      extensions,
    }),
    commonjs(),
    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
      plugins: ["styled-jsx/babel"],
    }),
    alias({
      entries: {
        "@": path.resolve(__dirname, "src"),
      },
    }),
  ],
}
