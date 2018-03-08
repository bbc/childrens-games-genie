// @ts-ignore
import * as fp from "lodash/fp";

import * as ButtonFactory from "./button-factory";
import { DebugButton } from "./debug-button";

const horizontal = {
    left: (pos, width, pad) => pos + pad,
    right: (pos, width, pad) => pos - width - pad,
    center: (pos, width, pad) => pos - width / 2,
};

const vertical = {
    top: (pos, height, pad) => pos + pad,
    middle: (pos, height, pad) => pos - height / 2,
    bottom: (pos, height, pad) => pos - (height + pad),
};

const getGroupPosition = (sizes) => ({
    x: getGroupX(sizes),
    y: getGroupY(sizes),
});

const getGroupX = (sizes) => {
    const horizontals = sizes.metrics[
        sizes.pos.v === "middle" ? "safeHorizontals" : "horizontals"
    ];

    return horizontal[sizes.pos.h](
        horizontals[sizes.pos.h] as number,
        sizes.width,
        sizes.metrics.borderPad * sizes.scale,
    );
};

const getGroupY = (sizes) =>
    vertical[sizes.pos.v](
        sizes.metrics.verticals[sizes.pos.v] as number,
        sizes.height,
        sizes.metrics.borderPad * sizes.scale,
    );

class Group extends Phaser.Group {
    private buttons: DebugButton[] = [];
    private buttonFactory: any; // TODO use ReturnType<ButtonFactory.create> with TS2.8
    private setGroupPosition: () => void;

    constructor(
        game: Phaser.Game,
        parent: Phaser.Group,
        private vPos,
        private hPos,
        private metrics,
        private isVertical,
    ) {
        super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));

        this.buttonFactory = ButtonFactory.create(game);
        this.setGroupPosition = fp.flow(this.getSizes, getGroupPosition, this.setPos);
        this.setGroupPosition();
    }

    /**
     * TODO add interface for config
     */
    public addButton(config, position?) {
        if (position === undefined) {
            position = this.buttons.length;
        }

        const newButton = this.buttonFactory.createButton(this.metrics.isMobile, config.key);

        this.addAt(newButton, position);
        this.buttons.push(newButton);

        this.alignChildren();
        this.setGroupPosition();

        return newButton;
    }

    public addToGroup(item: any, position = 0) {
        item.anchor.setTo(0.5, 0.5);
        this.addAt(item, position);
        this.alignChildren();
        this.setGroupPosition();
    }

    public reset(metrics) {
        if (this.metrics.isMobile !== metrics.isMobile) {
            this.resetButtons(metrics);
            this.alignChildren();
        }

        this.metrics = metrics;
        const invScale = 1 / metrics.scale;
        this.scale.setTo(invScale, invScale);
        this.setGroupPosition();
    }

    private alignChildren = () => {
        const pos = { x: 0, y: 0 };

        const groupWidth = this.width; //Save here as size changes when you move children below
        this.children.forEach((childDisplayObject: PIXI.DisplayObject) => {
            const child = childDisplayObject as PIXI.DisplayObjectContainer;
            child.y = pos.y + child.height / 2;

            if (this.isVertical) {
                child.x = groupWidth / 2;
                pos.y += child.height + this.metrics.buttonPad;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this.metrics.buttonPad;
            }
        }, this);
    };

    //TODO this is currently observer pattern but will eventually use pub/sub Phaser.Signals
    private resetButtons(metrics) {
        this.buttons.forEach(button => button.resize(metrics));
    }

    private getSizes = () => ({
        metrics: this.metrics,
        pos: { h: this.hPos, v: this.vPos },
        width: this.width,
        height: this.height,
        scale: this.scale.x,
    });

    private setPos = (coords: { x; y }) => {
        this.x = coords.x;
        this.y = coords.y;
    };
}

export default Group;
