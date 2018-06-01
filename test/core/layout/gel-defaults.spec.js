import { assert } from "chai";
import * as gel from "../../../src/core/layout/gel-defaults";

describe("Layout - Gel Defaults", () => {
    it("has an exit button with title 'Exit'", () => {
        assert(gel.config.exit.title === "Exit");
    });

    it("has a play button with group 'middleCenter'", () => {
        assert(gel.config.play.group === "middleCenter");
    });

    it("has a settings button with aria label 'Game Settings'", () => {
        assert(gel.config.settings.ariaLabel === "Game Settings");
    });

    it("has a home button with key 'home'", () => {
        assert(gel.config.home.key === "home");
    });
});
