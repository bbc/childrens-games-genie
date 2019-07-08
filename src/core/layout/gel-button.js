/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";

export class GelButton extends Phaser.Button {
    constructor(game, x, y, metrics, config) {
        super(
            game,
            x,
            y,
            assetPath({ key: config.key, isMobile: metrics.isMobile }),
            publish(config, { game }),
            undefined,
            1,
            0,
        );
        this._id = config.key;
        this._isMobile = metrics.isMobile;
        this.positionOverride = config.positionOverride;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.setHitArea(metrics);
        this.addIndicator();
    }

    setHitArea(metrics) {
        const hitPadding = fp.max([metrics.hitMin - this.width, metrics.hitMin - this.height, 0]);

        const width = this.width + hitPadding;
        const height = this.height + hitPadding;
        this.hitArea = new Phaser.Rectangle(-width / 2, -height / 2, width, height);
    }

    setImage(key) {
        this._id = key;
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: this._isMobile }));
    }

    resize(metrics) {
        this._isMobile = metrics.isMobile;
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);

        this.indicator && this.indicator.place();
    }

    addIndicator() {
        if (this._id === "achievements" && gmi.achievements.unseen) {
            this.indicator = this.game.add.sprite(0, 0, "shared.achievement-notification");
            this.addChild(this.indicator);
            this.indicator.scale = { x: 0, y: 0 };
            this.indicator.anchor.set(0.5, 0.5);
            this.game.add.tween(this.indicator.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true, 1000);

            this.indicator.clear = function() {
                this.indicator.destroy();
                delete this.indicator;
            }.bind(this)

            this.indicator.place = function() {
                this.indicator.position.x = this.width / 2;
                this.indicator.position.y = this.height / -2;
            }.bind(this)

            this.indicator.place();
        }
    }
}

const paths = [[x => x.isMobile, x => "gelMobile." + x.key], [x => !x.isMobile, x => "gelDesktop." + x.key]];

const assetPath = fp.cond(paths);

const publish = (config, data) => () => {
    GameSound.Assets.buttonClick.play();
    signal.bus.publish({
        channel: config.channel,
        name: config.key,
        data,
    });
};
