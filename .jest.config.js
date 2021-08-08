module.exports = {
  verbose: true,

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  transform: {
    "^.+\\.tsx?$": ["babel-jest", { configFile: "./tests/.babelrc.js" }],
  },

  testRegex: ".*\\.test\\.(j|t)sx?$",

  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
    "tests/(.*)$": "<rootDir>/tests/$1",
  },
}
