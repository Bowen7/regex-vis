module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["./src/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": ["babel-jest", { configFile: "./tests/.babelrc.js" }],
  },
  testRegex: ".*\\.test\\.(j|t)sx?$",
  moduleNameMapper: {
    "^.+\\.svg$": "<rootDir>/src/__mocks__/svgrMock.js",
    "@/(.*)$": "<rootDir>/src/$1",
    "tests/(.*)$": "<rootDir>/tests/$1",
  },
}
