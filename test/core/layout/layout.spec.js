import { assert } from "chai";
import * as sinon from "sinon";

import * as Layout from "../../../src/core/layout/layout";
import { Group } from "../../../src/core/layout/group";
import { GameAssets } from "../../../src/core/game-assets";

describe("Layout", () => {
    const sandbox = sinon.sandbox.create();
    const randomKey = "1d67c228681df6ad7f0b05f069cd087c442934ab5e4e86337d70c832e110c61b";
    let mockGame;
    let mockRoot;
    const mockMetrics = {
        horizontals: {},
        safeHorizontals: {},
        verticals: {},
    };

    beforeEach(() => {
        sandbox.stub(Group.prototype, "addButton").returns({ onInputUp: { add: sandbox.spy() } });
        return initialiseGame().then(game => {
            mockGame = game;
            mockRoot = { addChild: sandbox.spy(), children: [], updateTransform: sandbox.spy() };
        });
    });

    afterEach(() => {
        sandbox.restore();
        mockGame.destroy();
        GameAssets.sounds = {};
    });

    it("should add the correct number of GEL buttons for a given config", () => {
        const layout1 = Layout.create(mockGame, mockRoot, mockMetrics, ["achievements"]);
        assert(Object.keys(layout1.buttons).length === 1);

        const layout2 = Layout.create(mockGame, mockRoot, mockMetrics, ["play", "audioOff", "settings"]);
        assert(Object.keys(layout2.buttons).length === 3);

        const layout3 = Layout.create(mockGame, mockRoot, mockMetrics, [
            "achievements",
            "exit",
            "howToPlay",
            "play",
            "audioOff",
            "settings",
        ]);
        assert(Object.keys(layout3.buttons).length === 6);
    });

    it("Should create 11 Gel Groups", () => {
        const layout = Layout.create(mockGame, mockRoot, mockMetrics, []);
        assert(layout.root.children.length === 11);
    });

    it("Should add items to the correct group", () => {
        const layout = Layout.create(mockGame, mockRoot, mockMetrics, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);

        layout.addToGroup("middleRight", testElement);

        const groupsWithChildren = layout.root.children.filter(element => element.length);

        assert(groupsWithChildren.length === 1);
        assert(groupsWithChildren[0].name === "middleRight");
    });

    it("Should correctly insert an item using the index position property", () => {
        const layout = Layout.create(mockGame, mockRoot, mockMetrics, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);
        testElement.randomKey = randomKey;

        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));
        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));
        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));

        layout.addToGroup("topLeft", testElement, 2);

        const leftTopGroup = layout.root.children.find(element => element.name === "topLeft");
        assert(leftTopGroup.children[2].randomKey === randomKey);
    });

    it("Should set button callbacks using the 'setAction' method", () => {
        const layout = Layout.create(mockGame, mockRoot, mockMetrics, ["achievements", "exit", "settings"]);

        layout.setAction("exit", "testAction");
        assert(layout.buttons.exit.onInputUp.add.calledWith("testAction"));
    });

    it("Should add buttons using the correct tab order", () => {
        const rndOrder = [
            "exit",
            "home",
            "achievements",
            "howToPlay",
            "play",
            "settings",
            "audioOff",
            "audioOn",
            "previous",
            "next",
            "continue",
            "restart",
            "back",
            "pause",
        ];
        const tabOrder = [
            "exit",
            "home",
            "back",
            "audioOff",
            "audioOn",
            "settings",
            "pause",
            "previous",
            "play",
            "next",
            "achievements",
            "restart",
            "continue",
            "howToPlay",
        ];

        const layout = Layout.create(mockGame, mockRoot, mockMetrics, rndOrder);
        assert.deepEqual(Object.keys(layout.buttons), tabOrder);
    });
});

function initialiseGame() {
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;
    return new Promise(resolve => {
        new Phaser.Game({
            state: new class extends Phaser.State {
                create() {
                    resolve(this.game);
                }
            }(),
        });
    });
}
