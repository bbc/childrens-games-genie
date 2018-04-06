/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 */

import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Home extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.layoutFactory.keyLookups[this.game.state.current];
    }

    create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));

        //TODO the 'this' passed in here is passed through 4 files so it can be used in the gel button signal
        //TODO it can possibly refactored out to some extent.
        this.layoutFactory.addLayout(this, ["exit", "howToPlay", "play", "audioOff", "settings"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        signal.bus.subscribe({
            name: "GEL-play",
            callback: data => {
                console.log(data);
                this.next();
            },
        });
    }
}
