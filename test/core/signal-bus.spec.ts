import "../../src/lib/phaser";

import { assert } from "chai";


describe("Signal Bus", () => {

    it("Should callback with 100% progress when 0 files are to be loaded in gamePacks.", () => {


    });
});

/**
 * Wraps a test in asynchronous Phaser setup and shutdown code, and runs it in the preload phase of the first state.
 * @param action Function to run the tests, returning a promise.
 */
function runInPreload(action: (g: Phaser.Game) => Promise<void>): Promise<void> {
    const promisedTest = new PromiseTrigger<void>();
    const testState = new class extends Screen {
        public preload() {
            promisedTest.resolve(action(this.game));
        }
    }();
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
