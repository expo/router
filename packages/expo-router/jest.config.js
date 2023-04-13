module.exports = {
  preset: "jest-expo",
  roots: ["src"],
  setupFilesAfterEnv: ["./src/styling/__tests__/setup.ts"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/utils",
    "/__tests__/setup",
    ".d.ts$",
  ],
};
