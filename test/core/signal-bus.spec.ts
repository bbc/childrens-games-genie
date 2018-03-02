import "../../src/lib/phaser";

import { assert } from "chai";
import * as sinon from "sinon";

import * as SignalBus from "../../src/core/signal-bus";

describe("Signal Bus", () => {
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
        bus.publish("testSignal1", { exampleData: "abcdef" });

        bus.publish("testSignal2", { aa: "bb" });
        bus.publish("testSignal2", { aa: "bb" });

        assert(callback1.callCount === 3);
        assert(callback2.callCount === 3);
        assert(callback3.callCount === 2);
    });

    it("Should throw an error if you try to add the same signal name twice", () => {
        const bus = SignalBus.create();

        bus.add("testSignal1");
        assert.throws(() => bus.add("testSignal1"));
    });

    it("Should pass data from publisher to subscribers", () => {
        const bus = SignalBus.create();
        let receive;
        let send;

        bus.add("testSignal");
        bus.subscribe(data => (receive = data), "testSignal");

        send = { a: 1, b: 2, c: 3 };
        bus.publish("testSignal", send);
        assert(send === receive);

        send = { BBC: [1, 2, 3, 4, 5] };
        bus.publish("testSignal", send);
        assert(send === receive);
    });
});
