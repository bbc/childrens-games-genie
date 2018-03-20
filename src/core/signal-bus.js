/**
 * Pants module.
 * @module Signal Bus
 * @see module:my/shirt
 */
import fp from "../lib/lodash/fp/fp.js";

/**
 * Creates a new signal bus.
 * Use the exported const "bus" for a project global singleton
 *
 * @name Signal Bus
 *
 * @returns {{remove: (function(*)), subscribe: *, publish: *}}
 */
export const create = () => {
    const _bus = {};

    const addSignal = message => {
        if (!_bus[message.name]) {
            _bus[message.name] = new Phaser.Signal();
        }
        return message;
    };

    const remove = name => {
        _bus[name].dispose();
        delete _bus[name];
    };

    const addSubscription = message => _bus[message.name].add(message.callback);
    const publishMessage = message => _bus[message.name].dispatch(message.data);

    const subscribe = fp.flow(addSignal, addSubscription);
    const publish = fp.flow(addSignal, publishMessage);

    return { remove, subscribe, publish };
};

//Single instance
export const bus = create();
