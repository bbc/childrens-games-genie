// @ts-ignore
import * as fp from "lodash/fp";
import * as signal from "../signal-bus";

export class GelButton extends Phaser.Button {
    _id;

    constructor(game, x, y, isMobile, key) {
        super(game, 0, 0, assetPath({ key, isMobile }), publish(key));
        this._id = key;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
    }

    public resize(metrics) {
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
    }
}

const paths = [
    [(x) => x.isMobile, (x) => "gel/mobile/" + x.key + ".png"],
    [(x) => !x.isMobile, (x) => "gel/desktop/" + x.key + ".png"],
];

const signalId = key => "GEL-" + key;
const assetPath = fp.cond(paths);
const publish = key => () => signal.bus.publish({name: signalId(key)});
