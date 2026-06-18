// Đổi tên file thành: jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts', '!src/index.ts'],
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/config/",
    "src/models/",
    "src/routes/",
    "\\.d\\.ts$"
  ],
};