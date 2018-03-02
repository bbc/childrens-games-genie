/*

    X addSignal(name: string);
    removeSignal(name: string)
    X publish(name: string, data: any)
    X subscribe:(name)

    checks:
        * On subscribing to a signal is it the callback fired?
        * On publishing a signal is the data payload sent?
        * Signals use unique names
*/
export const create = () => {
    const bus = {};

    const add = name => {
        if (bus[name]) {
            throw new Error("Signal already exists");
        }
        bus[name] = new Phaser.Signal();
    };

    const remove = name => {
        bus[name].dispose();
        delete bus[name];
    };

    const subscribe = (callback, name) => bus[name].add(callback);
    const publish = (name, data?) => bus[name].dispatch(data);

    return { add, remove, subscribe, publish };
};
