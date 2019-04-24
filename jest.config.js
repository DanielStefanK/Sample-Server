module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};