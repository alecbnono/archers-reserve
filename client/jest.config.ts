export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jest-environment-jsdom',
    extensionsToTreatAsEsm: ['.ts', '.tsx'], 
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', 
        '^~/(.*)$': '<rootDir>/app/$1',
        '^@/(.*)$': '<rootDir>/app/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.json', 
            },
        ],
    },
    reporters: [
        "default",
        ["jest-html-reporter", { 
            pageTitle: "Client Side Test Report",
            includeFailureMsg: true,
            includeConsoleLog: true,
            sort: 'titleAsc'
        }]
    ],
};
