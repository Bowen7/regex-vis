module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["./tests/setupTests.ts"],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./tests/.babelrc.js" }],
  },
  testRegex: ".*\\.test\\.(j|t)sx?$",
  moduleNameMapper: {
    "^.+\\.svg$": "<rootDir>/tests/__mocks__/svgrMock.js",
    "@/(.*)$": "<rootDir>/src/$1",
    "tests/(.*)$": "<rootDir>/tests/$1",
    "@vercel/analytics/dist/react": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["node_modules/(?!(.*hex-rgb))"],
}
