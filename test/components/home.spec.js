import { assert } from "chai";
import * as sinon from "sinon";

import { Home } from "../../src/components/home";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";

describe("Home Screen", () => {
    let homeScreen;
    let mockGame;
    let addToBackgroundSpy;
    let gameImageSpy;
    let gameButtonSpy;

    const mockNext = () => {
        "nextFunc";
    };
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        sandbox.spy(layoutHarness, "createTestHarnessDisplay");

        addToBackgroundSpy = sandbox.spy();
        gameImageSpy = sandbox.spy();
        gameButtonSpy = sandbox.spy();

        mockGame = {
            add: {
                image: gameImageSpy,
                button: gameButtonSpy,
            },
            state: {
                current: "homeScreen",
            },
        };

        homeScreen = new Home();
        homeScreen.layoutFactory = {
            addToBackground: addToBackgroundSpy,
            keyLookups: {
                homeScreen: { keylookups: "keylookups" },
                gelDesktop: "thisIsGel",
                background: "backgroundImage",
                title: "titleImage",
            },
        };
        homeScreen.game = mockGame;
        homeScreen.nextFunc = mockNext;

        homeScreen.preload();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("adds current game state to the layout key lookups", () => {
            const expectedKeylookups = homeScreen.layoutFactory.keyLookups.homeScreen;
            assert.deepEqual(homeScreen.keyLookup, expectedKeylookups);
        });

        it("adds a key lookup to the current screen", () => {
            assert.exists(homeScreen.keyLookup);
        });
    });
});
