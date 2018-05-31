/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 */
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";
import fp from "../../lib/lodash/lodash.js";

const PlayButton = {
    Draw: (game, x, y) => {
        const button = game.add.sprite(x, y, "gelDesktop.play");
        button.anchor.setTo(0.5, 0.5);

        return button;
    },

    Redraw: (button, x, y) => {
        if (button) {
            button.x = x;
            button.y = y;
        }

        return button;
    }
}

export class Home extends Screen {
    constructor() {
        super();
    }

    create() {
        window.onresize = fp.debounce(this.resize.bind(this), 200);
        this.background = this.game.add.image(this.game.world.centerX, this.game.world.centerY, "home.background");
        this.background.anchor.setTo(0.5, 0.5);
        this.title = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 150, this.getAsset("title"));
        this.title.anchor.setTo(0.5, 0.5);
        this.scene.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
        createTestHarnessDisplay(this.game, this.context, this.scene);
        this.resize();

        //this.button = PlayButton.Draw(this.game, this.game.world.centerX, this.game.world.centerY);

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

        this.background.x = this.game.world.centerX;
        this.background.y = this.game.world.centerY;
        this.title.x = this.game.world.centerX;
        this.title.y = this.game.world.centerY - 150;
        //PlayButton.Redraw(this.button, this.game.world.centerX, this.game.world.centerY);
    }
}
