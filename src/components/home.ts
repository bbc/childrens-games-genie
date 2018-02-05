import { ScreenMap } from "src/core/asset-loader";
import * as Scaler from "src/core/scaler";
import { Screen } from "src/core/screen";

export class Home extends Screen {
    private keyLookup: { [key: string]: string };
    private gel: { [key: string]: string };

    constructor() {
        super();
    }

    public preload() {
        this.keyLookup = this.context.layout.keyLookups.home;
        this.gel = this.context.layout.keyLookups.gel;
    }

    public create() {
        this.context.layout.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
        this.context.layout.addToBackground(this.game.add.image(0, -130, this.keyLookup.title));
        this.context.layout.addToBackground(this.game.add.button(0, 130, this.gel.play));
    }
}
