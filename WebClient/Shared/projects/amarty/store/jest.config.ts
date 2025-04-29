import { Config } from 'jest';

const config: Config = {
  displayName: 'amarty-store',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../../../../coverage/libs/amarty/store',
  transform: {
    '^.+\\.(ts|js|html)$': ['jest-preset-angular', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
};

export default config;
