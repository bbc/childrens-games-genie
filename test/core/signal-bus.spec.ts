import "../../src/lib/phaser";

import { assert } from "chai";
import * as sinon from "sinon";

import * as SignalBus from "../../src/core/signal-bus";

describe("Signal Bus", () => {
    it("Should fire the correct callbacks when a signal is published", () => {
        const bus = SignalBus.create();

        const callback1 = sinon.spy();
        const callback2 = sinon.spy();
        const callback3 = sinon.spy();

        bus.subscribe({callback: callback1, name: "testSignal1"});
        bus.subscribe({callback: callback2, name: "testSignal2"});
        bus.subscribe({callback: callback3, name: "testSignal3"});

        bus.publish({name: "testSignal1"});
        bus.publish({name: "testSignal1", data: 12345});
        bus.publish({name: "testSignal1", data: { exampleData: "abcdef" }});

        bus.publish({name: "testSignal2", data: { aa: "bb" }});
        bus.publish({name: "testSignal2", data: { aa: "bb" }});

        assert(callback1.callCount === 3);
        assert(callback2.callCount === 2);
        assert(callback3.callCount === 0);
    });

    it("Should remove signals correctly", () => {
        //TODO
    });

    it("Should pass data from publisher to subscribers", () => {
        const bus = SignalBus.create();
        let received;
        let data;

        bus.subscribe({callback: newData => (received = newData), name: "testSignal"});

        data = { a: 1, b: 2, c: 3 };
        bus.publish({name: "testSignal", data});
        assert(data === received);

        data = { BBC: [1, 2, 3, 4, 5] };
        bus.publish({name: "testSignal", data});
        assert(data === received);
    });
});
