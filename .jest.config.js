module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["./tests/setupTests.ts", "jest-canvas-mock"],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./tests/.babelrc.js" }],
  },
  testRegex: ".*\\.test\\.(j|t)sx?$",
  moduleNameMapper: {
    "^.+\\.svg$": "<rootDir>/tests/__mocks__/svgrMock.js",
    "@/(.*)$": "<rootDir>/src/$1",
    "tests/(.*)$": "<rootDir>/tests/$1",
    "@vercel/analytics/dist/react": "<rootDir>/tests/__mocks__/analytics.js",
    "^.+\\.(css|less)$": "<rootDir>/tests/__mocks__/css.js",
  },
  transformIgnorePatterns: ["node_modules/(?!(.*hex-rgb))"],
}
