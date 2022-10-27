/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "jest-puppeteer",
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["<rootDir>/**/*.test.+(ts|js)"],
};
