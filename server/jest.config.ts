export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    moduleNameMapper: {
        //If the import ends in .js Jest looks for the .ts file equivalent instead
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },transform: {
        '^.+\\.tsx?$': [
        'ts-jest',
        {
            useESM: true,
        },
        ],
    },
    testMatch: ['**/*.test.ts'],
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {
            pageTitle: "Server side Test Report",
            includeFailureMsg: true,
            includeConsoleLog: true,
            sort: 'titleAsc'
        }]
    ]
};