/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as AssetLoader from "../../src/core/asset-loader.js";

describe("Asset Loader", () => {
    let assetsLoaded;
    let fakeGame;
    let mockTheme;
    let fakeGamePacksToLoad;
    let fakeLoadscreenPack;
    let fakeCallback;
    let nextLoadInQueue;

    beforeEach(() => {
        fakeGamePacksToLoad = {
            ["MasterAssetPack"]: { url: "asset-master-pack.json" },
            ["GelAssetPack"]: { url: "gel/gel-pack.json" },
        };
        fakeLoadscreenPack = { key: "loadscreen", url: "loader/loadscreen-pack.json" };
        fakeGame = {
            load: {
                onFileComplete: { add: jest.fn(), removeAll: jest.fn() },
                onLoadComplete: { add: jest.fn(), removeAll: jest.fn() },
                json: jest.fn(),
                pack: jest.fn(),
                totalQueuedPacks: jest.fn().mockImplementation(() => 0),
                start: "start",
            },
            time: { events: { add: jest.fn() } },
            cache: { getJSON: jest.fn() },
            state: {
                states: {
                    __proto: {},
                    default: {},
                    "character-select": {},
                },
            },
        };
        fakeCallback = jest.fn();

        fakeGame.cache.getJSON.mockImplementation(packType => {
            if (packType === "MasterAssetPack") {
                return {
                    howToPlay: [{ type: "image", key: "background", url: "background.png", overwrite: false }],
                    pause: [{ type: "image", key: "title", url: "title.png", overwrite: false }],
                };
            }
            if (packType === "GelAssetPack") {
                return { gelDesktop: [{ type: "spritesheet", key: "achievements", url: "achievements.png" }] };
            }
            if (packType === "character-select") {
                return {
                    "character-select": [
                        { type: "image", key: "title", url: "title.png", overwrite: false },
                        { type: "image", key: "background", url: "background.png", overwrite: false },
                    ],
                };
            }
        });

        mockTheme = { home: {}, game: {} };
        assetsLoaded = AssetLoader.loadAssets(
            fakeGame,
            fakeGamePacksToLoad,
            fakeLoadscreenPack,
            fakeCallback,
            mockTheme,
        );

        nextLoadInQueue = fakeGame.load.onLoadComplete.add.mock.calls[0][0];
        nextLoadInQueue();
        nextLoadInQueue();
        nextLoadInQueue();
    });

    afterEach(() => jest.clearAllMocks());

    test("loads all the game json files", () => {
        return assetsLoaded.then(() => {
            expect(fakeGame.load.json).toHaveBeenCalledWith("MasterAssetPack", "asset-master-pack.json");
            expect(fakeGame.load.json).toHaveBeenCalledWith("GelAssetPack", "gel/gel-pack.json");
        });
    });

    test("loads json files for missing screens", () => {
        return assetsLoaded.then(() => {
            expect(fakeGame.load.json).toHaveBeenCalledWith("character-select", "character-select.json");
        });
    });

    test("does not loads json files for __proto and default screens", () => {
        return assetsLoaded.then(() => {
            expect(fakeGame.load.json).not.toHaveBeenCalledWith("__proto");
            expect(fakeGame.load.json).not.toHaveBeenCalledWith("default");
        });
    });

    test("saves the json files to the game cache", () => {
        return assetsLoaded.then(() => {
            expect(fakeGame.cache.getJSON).toHaveBeenCalledWith("MasterAssetPack");
            expect(fakeGame.cache.getJSON).toHaveBeenCalledWith("GelAssetPack");
            expect(fakeGame.cache.getJSON).toHaveBeenCalledWith("character-select");
        });
    });

    test("loads the loadscreen json", () => {
        return assetsLoaded.then(() => {
            expect(fakeGame.load.pack).toHaveBeenCalledWith("loadscreen", "loader/loadscreen-pack.json");
        });
    });

    test("adds a game time event for each load iteration", () => {
        return assetsLoaded.then(() => {
            expect(fakeGame.time.events.add).toHaveBeenCalledTimes(3);
            expect(fakeGame.time.events.add).toHaveBeenCalledWith(0, fakeGame.load.start, fakeGame.load);
        });
    });

    test("updates the callback with the load progress so far", () => {
        return assetsLoaded.then(() => {
            expect(fakeCallback).toHaveBeenCalledWith(100);
        });
    });

    test("returns the keyLookUps with correct screen prefixes when loading is complete", () => {
        const expectedLookUps = {
            howToPlay: {
                background: "howToPlay.background",
            },
            pause: {
                title: "pause.title",
            },
            gelDesktop: {
                achievements: "gelDesktop.achievements",
            },
            "character-select": {
                title: "character-select.title",
                background: "character-select.background",
            },
        };
        nextLoadInQueue();
        return assetsLoaded.then(keyLookUps => {
            expect(keyLookUps).toEqual(expectedLookUps);
        });
    });

    test("loads fine when achievements are true", () => {
        // mockTheme = { home: {}, game: { achievements: true } };
        // assetsLoaded = AssetLoader.loadAssets(fakeGame, fakeGamePacksToLoad, fakeLoadscreenPack, fakeCallback, mockTheme);
        // nextLoadInQueue = fakeGame.load.onLoadComplete.add.mock.calls[0][0];
        // nextLoadInQueue();
        // nextLoadInQueue();
        nextLoadInQueue();
        return assetsLoaded.then(() => {
            expect(fakeGame.load.onLoadComplete.removeAll).toHaveBeenCalled();
            expect(fakeGame.load.onFileComplete.removeAll).toHaveBeenCalled();
        });
    });

    test("clears all the files when loading is complete", () => {
        nextLoadInQueue();
        return assetsLoaded.then(() => {
            expect(fakeGame.load.onLoadComplete.removeAll).toHaveBeenCalled();
            expect(fakeGame.load.onFileComplete.removeAll).toHaveBeenCalled();
        });
    });
});
