import fp from "../../../lib/lodash/fp/fp.js";

import * as ButtonFactory from "./button-factory.js";

const horizontal = {
    left: (group, metrics) => {
        group.left = metrics.horizontals.left + metrics.borderPad;
    },
    right: (group, metrics) => {
        group.right = metrics.horizontals.right - metrics.borderPad;
    },
    center: (group, metrics) => {
        group.centerX = metrics.horizontals.center;
    },
};
const vertical = {
    top: (group, metrics) => {
        group.top = metrics.verticals.top + metrics.borderPad;
    },
    middle: (group, metrics) => {
        group.centerY = metrics.verticals.middle;
    },
    bottom: (group, metrics) => {
        group.bottom = metrics.verticals.bottom - metrics.borderPad;
    },
};

export class Group extends Phaser.Group {
    constructor(game, parent, vPos, hPos, metrics, isVertical) {
        super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));

        this._vPos = vPos;
        this._hPos = hPos;
        this._metrics = metrics;
        this._isVertical = isVertical;
        this._buttons = [];
        this._buttonFactory = ButtonFactory.create(game);
        this._setGroupPosition = metrics => {
            horizontal[hPos](this, metrics);
            vertical[vPos](this, metrics);
        };
    }

    /**
     * TODO add interface for config
     */
    addButton(config, position = this._buttons.length) {
        const newButton = this._buttonFactory.createButton(
            this._metrics,
            config,
            this.getLocalBounds().halfWidth,
            this.getLocalBounds().halfHeight,
        );

        this.addAt(newButton, position);
        this._buttons.push(newButton);

        this.alignChildren();
        // this._setGroupPosition(this._metrics);

        return newButton;
    }

    addToGroup(item, position = 0) {
        item.anchor.setTo(0.5, 0.5);
        this.addAt(item, position);
        this.alignChildren();
        // this._setGroupPosition(this._metrics);
    }

    reset(metrics) {
        console.log("reset");
        if (this._metrics.isMobile !== metrics.isMobile) {
            this.resetButtons(metrics);
        }
        this.alignChildren();

        this._metrics = metrics;
        const invScale = 1 / metrics.scale;
        this.scale.setTo(invScale, invScale);
        this._setGroupPosition(metrics);
    }

    alignChildren() {
        const pos = { x: this.game.world.centerX, y: this.game.world.centerY };

        const halfWidth = this.getLocalBounds().halfWidth; //Save here as size changes when you move children below
        this.children.forEach(childDisplayObject => {
            const child = childDisplayObject;
            child.y = pos.y + child.height / 2;

            if (this._isVertical) {
                child.x = halfWidth;
                pos.y += child.height + this._metrics.buttonPad;
            } else if (this._hPos == "center" && this._vPos == "middle") {
                child.y = 0;
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this._metrics.buttonPad * 3;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this._metrics.buttonPad;
            }
        }, this);
    }

    //TODO this is currently observer pattern but will eventually use pub/sub Phaser.Signals
    resetButtons(metrics) {
        this._buttons.forEach(button => button.resize(metrics));
    }
}
