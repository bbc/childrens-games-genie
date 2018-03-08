// @ts-ignore
import * as fp from "lodash/fp";

import { assert } from "chai";
import { loadAssets } from "../../../src/core/asset-loader";
import { PromiseTrigger } from "../../../src/core/promise-utils";
import { Screen } from "../../../src/core/screen";
import { startup } from "../../../src/core/startup";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";

import { GelButton } from "../../../src/core/layout/gel-button";

import * as sinon from "sinon";

describe("Layout - Gel Button", () => {
    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    it("Should swap mobile and desktop assets when resized.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const gelPack = {
            key: "gel",
            url: assetPacks.gelButtonAssetPack,
        };

        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                const btn = new GelButton(game, 0, 0, true, "play");

                assert(btn.key === "gel/mobile/play.png");

                btn.resize({ isMobile: false } as any);
                assert(btn.key === "gel/desktop/play.png");

                btn.resize({ isMobile: true } as any);
                assert(btn.key === "gel/mobile/play.png");
            }),
        );
    });

    it("Should be centered.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const gelPack = {
            key: "gel",
            url: assetPacks.gelButtonAssetPack,
        };

        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                const btn = new GelButton(game, 0, 0, true, "play");
                assert(fp.isEqual(btn.anchor, new Phaser.Point(0.5, 0.5)));
            }),
        );
    });
});

/**
 * Wraps a test in asynchronous Phaser setup and shutdown code, and runs it in the preload phase of the first state.
 * @param action Function to run the tests, returning a promise.
 */
function runInPreload(action: (g) => Promise<void>): Promise<void> {
    let testState;
    const promisedTest = new Promise(resolve => {
        testState = new class extends Screen {
            public preload() {
                resolve(action(this.game));
            }
        }();
    });

    const transitions = [
        {
            name: "loadscreen",
            state: testState,
            nextScreenName: () => "loadscreen",
        },
    ];
    return startup(transitions)
        .then(game => promisedTest.then(() => game))
        .then(game => game.destroy());
}
