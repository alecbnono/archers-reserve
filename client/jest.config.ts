export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {
            pageTitle: "Server side Test Report",
            includeFailureMsg: true,
            includeConsoleLog: true,
            sort: 'titleAsc'
        }]
    ],
};
// TODO: finish setup for client side jest