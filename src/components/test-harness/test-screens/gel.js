import { Screen } from "../../../core/screen.js";

export class Home extends Screen {
    constructor() {
        super();
    }

    preload() {}

    create() {
        this.layoutFactory.addLayout([
            "exit",
            "home",
            "achievements",
            "howToPlay",
            "play",
            "settings",
            "audioOff",
            "audioOn",
            "previous",
            "next",
            "continue",
            "restart",
            "back",
            "pause",
        ]);
    }
}