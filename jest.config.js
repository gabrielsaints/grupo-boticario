module.exports = {
  verbose: true,
  coverageDirectory: './src/__tests__/coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFiles: ['dotenv/config'],
  testRegex: ['(/__tests__/.*(\\.test))\\.[t]sx?$'],
};
