export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
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