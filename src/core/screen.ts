import * as _ from "lodash";
import "../lib/phaser";

export class Screen extends Phaser.State {
    protected layoutFactory;

    private _context;
    private _next;

    public get context() {
        return this._context;
    }

    public set context(newContext) {
        this._context = _.merge({}, this._context, newContext);
    }

    public init(context, next, layoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context;
        this._next = next;
    }

    public next(changedState?) {
        this._next(changedState);
    }
}
