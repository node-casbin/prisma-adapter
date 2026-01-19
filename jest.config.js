module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '**/test/*.+(ts|tsx)'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  // Custom resolver to support Prisma v7 subpath imports
  resolver: './jest-resolver.js'
};
