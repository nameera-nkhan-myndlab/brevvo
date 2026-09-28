module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1', '\\.(css|module\\.css)$': '<rootDir>/src/__mocks__/styleMock.js' },
  transform: { '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { presets: ['next/babel'] }] },
};