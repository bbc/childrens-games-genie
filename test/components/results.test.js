/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { Results } from "../../src/components/results";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel, achievementsChannel } from "../../src/core/layout/gel-defaults.js";

describe("Results Screen", () => {
    let resultsScreen;
    let mockGame;
    let mockContext;
    let mockGmi;
    let mockAchievementButton;

    beforeEach(() => {
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});
        mockGame = {
            add: {
                image: jest.fn().mockImplementation((x, y, imageName) => imageName),
                button: jest.fn(),
                text: jest.fn(),
            },
            state: {
                current: "resultsScreen",
            },
        };

        mockContext = {
            config: {
                theme: {
                    resultsScreen: {
                        resultText: {
                            style: { font: "36px ReithSans" },
                        },
                    },
                    game: {},
                },
            },
        };

        mockGmi = { sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

        mockAchievementButton = { buttons: { achievements: { setIndicator: jest.fn() } } };

        resultsScreen = new Results();
        resultsScreen.scene = {
            addToBackground: jest.fn(),
            addLayout: jest.fn(),
            getLayouts: jest.fn().mockImplementation(() => [mockAchievementButton]),
        };
        resultsScreen.game = mockGame;
        resultsScreen.context = mockContext;
        resultsScreen.transientData = {
            results: 22,
            characterSelected: 1,
        };
        resultsScreen.preload();
        resultsScreen.navigation = {
            next: jest.fn(),
            game: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Create Method", () => {
        test("adds a background image", () => {
            resultsScreen.create();
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "results.background");
            expect(resultsScreen.scene.addToBackground).toHaveBeenCalledWith("results.background");
        });

        test("adds a title image", () => {
            resultsScreen.create();
            expect(mockGame.add.image).toHaveBeenCalledWith(0, -150, "results.title");
            expect(resultsScreen.scene.addToBackground).toHaveBeenCalledWith("results.title");
        });

        test("loads the game results text", () => {
            resultsScreen.create();
            const expectedResultsData = 22;
            expect(mockGame.add.text).toHaveBeenCalledWith(0, 50, expectedResultsData, { font: "36px ReithSans" });
        });

        test("adds GEL buttons to layout", () => {
            resultsScreen.create();
            const expectedButtons = ["pause", "restart", "continueGame"];
            expect(resultsScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            resultsScreen.create();
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(
                mockGame,
                mockContext,
                resultsScreen.scene,
            );
        });

        test("adds the achievement button when theme flag is set", () => {
            resultsScreen.context.config.theme.game.achievements = true;
            resultsScreen.create();
            const expectedButtons = ["pause", "restart", "continueGame", "achievements"];
            expect(resultsScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        describe("Stats", () => {
            test("fires a score stat with results if given as a number", () => {
                resultsScreen.transientData.results = 45;
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { metadata: "SCO=[45]" });
            });

            test("fires a score stat with results if given as a string with numbers in", () => {
                resultsScreen.transientData.results = "Your score is 593";
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { metadata: "SCO=[593]" });
            });

            test("fires a score stat without results if a string with no numbers is given", () => {
                resultsScreen.transientData.results = "You completed the game!";
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", undefined);
            });

            test("fires a score stat to the GMI without results if neither a string nor a number is given", () => {
                resultsScreen.transientData.results = [];
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", undefined);
            });

            test("fires a score stat to the GMI without results if not provided", () => {
                resultsScreen.transientData.results = undefined;
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", undefined);
            });
        });
    });

    describe("signals", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "subscribe");
            resultsScreen.create();
        });

        describe("the continue button", () => {
            test("adds a signal subscription", () => {
                expect(signal.bus.subscribe.mock.calls[0][0].name).toBe("continue");
                expect(signal.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel);
            });

            test("navigates to the next screen when clicked", () => {
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(resultsScreen.navigation.next).toHaveBeenCalled();
            });
        });

        describe("the restart button", () => {
            test("adds a signal subscription", () => {
                expect(signal.bus.subscribe.mock.calls[1][0].name).toBe("restart");
                expect(signal.bus.subscribe.mock.calls[1][0].channel).toBe(buttonsChannel);
            });

            test("restarts the game and passes saved data through", () => {
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(resultsScreen.navigation.game).toHaveBeenCalledWith({ characterSelected: 1, results: 22 });
            });
        });

        describe("achievement notification closed", () => {
            test("adds a signal subscription", () => {
                expect(signal.bus.subscribe.mock.calls[2][0].name).toBe("achievements-close");
                expect(signal.bus.subscribe.mock.calls[2][0].channel).toBe(achievementsChannel);
            });

            test("updates the seen/unseen notification indicator on the achievements button", () => {
                signal.bus.subscribe.mock.calls[2][0].callback();
                const { setIndicator } = mockAchievementButton.buttons.achievements;
                expect(setIndicator).toHaveBeenCalled();
            });
        });
    });
});
