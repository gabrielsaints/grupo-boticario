module.exports = {
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: ['(/__tests__/.*(\\.test))\\.[t]sx?$'],
};
