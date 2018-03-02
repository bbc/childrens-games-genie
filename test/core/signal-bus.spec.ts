import "../../src/lib/phaser";

import { assert } from "chai";
import * as sinon from "sinon";

import * as SignalBus from "../../src/core/signal-bus";

       // * On subscribing to a signal is it the callback fired?
       // * On publishing a signal is the data payload sent?
       // * Signals use unique names


describe.only("Signal Bus", () => {

    it("Should fire the correct callbacks when a signal is published", () => {
        const bus = SignalBus.create();

        bus.add("testSignal1");
        bus.add("testSignal2");

        const callback1 = sinon.spy();
        const callback2 = sinon.spy();
        const callback3 = sinon.spy();

        bus.subscribe(callback1, "testSignal1");
        bus.subscribe(callback2, "testSignal1");
        bus.subscribe(callback3, "testSignal2");

        bus.publish("testSignal1");
        bus.publish("testSignal1", 12345);
        bus.publish("testSignal1", {exampleData: "abcdef"});

        bus.publish("testSignal2", {aa: "bb"});
        bus.publish("testSignal2", {aa: "bb"});

        assert(callback1.callCount === 3);
        assert(callback2.callCount === 3);
        assert(callback3.callCount === 2);
    });

    it("Should only allow unique signal names", () => {
        const bus = SignalBus.create();

        bus.add("testSignal1");
        bus.add("testSignal1");
    });
});

/**
 * Wraps a test in asynchronous Phaser setup and shutdown code, and runs it in the preload phase of the first state.
 * @param action Function to run the tests, returning a promise.
 */
// function runInPreload(action: (g: Phaser.Game) => Promise<void>): Promise<void> {
//     const promisedTest = new PromiseTrigger<void>();
//     const testState = new class extends Screen {
//         public preload() {
//             promisedTest.resolve(action(this.game));
//         }
//     }();
//     const transitions = [
//         {
//             name: "loadscreen",
//             state: testState,
//             nextScreenName: () => "loadscreen",
//         },
//     ];
//     return startup(transitions)
//         .then(game => promisedTest.then(() => game))
//         .then(game => game.destroy());
// }
