/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
    collectCoverageFrom: ["src/**/*.js", "!src/components/test-harness/**/*.js", "!src/output/**/*.js"],
    coverageThreshold: {
        global: {
            statements: 90.8,
            branches: 83.0,
            functions: 86.26,
            lines: 91.9,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
    setupFilesAfterEnv: ["./test/set-up-jest.js"],
    transform: { "^.+\\.js$": "babel-jest" },
    transformIgnorePatterns: ["node_modules/(?!(bowser)/)"],
};
