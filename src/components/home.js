/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 */
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";
import fp from "../../lib/lodash/lodash.js";

export class Home extends Screen {
    constructor() {
        super();
    }

    create() {
        this.root = this.game.add.group();

        window.onresize = fp.debounce(this.resize.bind(this), 200);

        this.background = this.game.add.image(0, 0, "home.background");
        this.background.anchor.setTo(0.5, 0.5);

        this.title = this.game.add.image(0, -150, this.getAsset("title"));
        this.title.anchor.setTo(0.5, 0.5);
        //this.scene.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);

        createTestHarnessDisplay(this.game, this.context, this.scene);
        this.resize();

        this.button = this.game.add.sprite(0, 0, "gelDesktop.play");
        this.button.anchor.setTo(0.5, 0.5);
        this.root.add(this.background);
        this.root.add(this.title);
        this.root.add(this.button);
        this.root.position.set(this.game.world.centerX, this.game.world.centerY);

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "play",
            callback: () => {
                this.navigation.next();
            },
        });
    }

    resize() {
        const aspectRatio = window.innerWidth / window.innerHeight;

        if (aspectRatio > (7/3)) {
            this.game.scale.setGameSize(1400, 600);
        } else if (aspectRatio < 4/3) {
            this.game.scale.setGameSize(800, 600);
        } else { // between 4/3 and 7/3
            this.game.scale.setGameSize(aspectRatio * 600, 600);
        }

        this.root.position.set(this.game.world.centerX, this.game.world.centerY);
        if (this.button) {
            this.button.scale.setTo(600 / window.innerHeight);
        }
    }
}
