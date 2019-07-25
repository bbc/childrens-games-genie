/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import _ from "../../lib/lodash/lodash.js";

import { gmi } from "../core/gmi/gmi.js";
import * as signal from "../core/signal-bus.js";
import * as GameSound from "../core/game-sound.js";
import * as a11y from "../core/accessibility/accessibility-layer.js";
import * as VisibleLayer from "../core/visible-layer.js";
import fp from "../../lib/lodash/fp/fp.js";

/**
 * The `Screen` class extends `Phaser.State`, providing the `Context` to objects that extend from it.
 * All the game screens will extend from this class.
 */
export class Screen extends Phaser.State {
    get context() {
        return this._context;
    }

    set context(newContext) {
        this._context = _.merge({}, this._context, newContext);
    }

    getAsset(name) {
        return this.game.state.current + "." + name;
    }

    init(transientData, scene, context, navigation) {
        this.scene = scene;
        this._context = context;
        this.navigation = navigation[this.game.state.current].routes;
        const themeScreenConfig = this.context.config.theme[this.game.state.current];
        if (this.game.state.current !== "loadscreen") {
            gmi.setStatsScreen(this.game.state.current);
        }
        GameSound.setupScreenMusic(this.game, themeScreenConfig);
        this.transientData = transientData;
        a11y.clearAccessibleButtons();
        a11y.clearElementsFromDom();
        this.overlaySetup();

        const routes = navigation[this.game.state.current].routes;
        this.navigation = fp.mapValues(value => () => value(this.transientData || {}), routes)
    }

    overlaySetup() {
        signal.bus.subscribe({
            channel: "overlays",
            name: "overlay-closed",
            callback: this.onOverlayClosed.bind(this),
        });
    }

    onOverlayClosed(data) {
        a11y.clearElementsFromDom();
        a11y.clearAccessibleButtons(this);
        this.context.popupScreens.pop();
        a11y.appendElementsToDom(this);
        if (data.firePageStat) {
            gmi.setStatsScreen(this.game.state.current);
        }
        signal.bus.removeChannel("overlays");
        this.overlaySetup();
    }

    get visibleLayer() {
        return VisibleLayer.get(this.game, this.context);
    }
}
