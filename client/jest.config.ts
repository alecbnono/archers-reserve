export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    moduleNameMapper: {
        // This handles CSS/Asset imports which break Jest
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    },
    reporters: [
        "default",
        ["jest-html-reporter", { // Simplified path
            pageTitle: "Client Side Test Report",
            includeFailureMsg: true,
            includeConsoleLog: true,
            sort: 'titleAsc'
        }]
    ],
};
// TODO: finish setup for client side jest