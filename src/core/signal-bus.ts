export const create = () => {
    const _bus = {};

    const add = name => {
        if (!_bus[name]) {
            _bus[name] = new Phaser.Signal();
        }
    };

    const remove = name => {
        _bus[name].dispose();
        delete bus[name];
    };

    const subscribe = (callback, name) => _bus[name].add(callback);
    const publish = (name, data?) => _bus[name].dispatch(data);

    return { add, remove, subscribe, publish };
};

//Single instance
export const bus = create();
