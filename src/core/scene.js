/**
 * A Genie scene is instantiated once in {@link module:core/navigation}
 *
 * It instantiates {@link module:core/scaler} and provides methods for adding display objects to foreground and
 * background groups (It is expected that most of a game would be added to the background group and any overlays /
 * HUD would go in the foreground group).
 *
 * It also provides a factory function for making [ gel layouts]{@link module:layout/layout}
 * and sets the phaser debug sprite to be at the top of the display list
 *
 * @example
 * this.scene.addToBackground(this.game.add.image(0, 0, "sceneName.background"));
 * this.scene.addToBackground(this.game.add.image(0, -150, "sceneName.title"));
 * this.scene.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
 *
 * @module core/scene
 */
import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "../core/signal-bus.js";
import * as Layout from "./layout/layout.js";
import * as Scaler from "./scaler.js";

const centerAnchor = object => {
    if (object.anchor) {
        object.anchor.setTo(0.5, 0.5);
    }
    return object;
};

const addToGroup = fp.curry((group, object) => group.addChild(object));

/**
 * Create a new Scene
 *
 * @param {Phaser.Game} game
 * @returns {{addToBackground(), addToForeground(), addLayout(), removeAll(), getSize()}} - {{@link module:layout/factory.addLayout addLayout}}
 */
export function create(game) {
    let _layouts = [];
    const root = game.add.group(undefined, "root", true);
    const unscaled = game.add.group(undefined, "unscaled", true);
    const background = game.add.group(undefined, "background");
    const foreground = game.add.group(undefined, "foreground");
    const debug = game.add.group(undefined, "debug", true);

    root.addChild(background);
    root.addChild(foreground);
    if (game.debug.sprite) {
        root.addChild(game.debug.sprite);
    }

    signal.bus.subscribe({
        channel: "scaler",
        name: "onScaleChange",
        callback: () => {
            root.position.set(game.world.centerX, game.world.centerY);
        },
    });

    //TODO stageHeight should come from config
    const scaler = Scaler.create(600, game);

    /**
     * Create a new GEL layout for a given set of Gel Buttons
     * Called in the create method of a given screen
     *
     * @example
     * scene.addLayout(["home", "restart", "continue", "pause"]);
     * @param {Array} buttons - Array of standard button names to include. See {@link ./gel-defaults.js} for available names
     *
     * @memberof module:layout/factory
     * @returns {Object}
     */
    const addLayout = buttons => {
        const layout = Layout.create(game, scaler, buttons);
        //addToGroup(background, layout.root);
        _layouts.push(layout);
        return layout;
    };

    const addToBackground = fp.flow(centerAnchor, addToGroup(background));
    const addToForeground = fp.flow(centerAnchor, addToGroup(foreground));
    const addToUnscaled = fp.flow(centerAnchor, addToGroup(unscaled));

    const getLayouts = () => _layouts;

    const removeAll = () => {
        background.removeAll(true);
        _layouts.forEach(layout => layout.destroy());
        _layouts = [];
    };

    return {
        addToBackground,
        addToForeground,
        addToUnscaled,
        addLayout,
        getLayouts,
        removeAll,
        getSize: scaler.getSize,
    };
}
