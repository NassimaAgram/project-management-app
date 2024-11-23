import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/src/__mocks__/prisma.ts",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
};

export default config;
