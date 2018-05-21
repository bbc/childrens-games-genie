import _ from "../lib/lodash/lodash.js";
import { getScreenAssets } from "./assets.js";

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

    init(context, next, layoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context;
        this._next = next;
        this.assets = getScreenAssets(this);
    }

    getAsset(name) {
        return this.game.state.current + "." + name;
    }

    next(changedState) {
        this._next(changedState);
    }
}
