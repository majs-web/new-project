
// Set what folders to ignore:
export default {
    testEnvironment: "node",
    transform: {},
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{js,mjs}',

        // always exclude
        '!**/node_modules/**',
        '!**/coverage/**',

        //exclude tests themselves
        '!**/*.test.{js,mjs}',
        
        // exclude static / templates
        '!public/**',
        '!views/**',

        // exclude config scripts
        '!jest.config.{js,mjs}',
        '!eslint.config.{js,mjs}',
        '!**/config/**'
    ],
    testPathIgnorePatterns: ['/node_modules/', '/examples'],
};

// To see test coverage:
// npm test -- --coverage

// NB: To mock, instead of using jest.mock, use 
// jest.unstable_mockModule, e.g.:

/* await jest.unstable_mockModule('fs', () => ({
    existsSyns: jest.fn(),
    readFileSync: jest.fn(),
})); */

// To access jest object in ESM, import it: 
// either

/* import { jest } from '@jest/globals';

jest.useFakeTimers();

// or

import.meta.jest.useFakeTimers(); */