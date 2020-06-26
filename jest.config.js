/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
    collectCoverageFrom: ["src/**/*.js", "!src/components/test-harness/**/*.js", "!src/output/**/*.js"],
    coverageThreshold: {
        global: {
            statements: 97.71,
            branches: 90.66,
            lines: 97.98,
            functions: 96.39,
        },
        "src/core/layout/gel-button.js": {
            statements: 9.09,
            branches: 0,
            lines: 10.26,
            functions: 0,
        },
        "src/core/layout/debug-button.js": {
            statements: 0,
            branches: 0,
            lines: 0,
            functions: 0,
        },
        "src/core/startup.js": {
            statements: 67.74,
            branches: 68.42,
            lines: 71.19,
            functions: 41.18,
        },
        "src/main.js": {
            statements: 0,
            branches: 0,
            lines: 0,
            functions: 0,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
    setupFilesAfterEnv: ["./test/set-up-jest.js"],
    transform: { "^.+\\.js$": "babel-jest" },
    transformIgnorePatterns: ["node_modules/(?!(bowser)/)"],
};
