import * as sinon from "sinon";
import { expect } from "chai";
import * as GameSound from "../../src/core/game-sound.js";
import * as Game from "../fake/game.js";

describe("Game Sound", () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
        GameSound.Assets.backgroundMusic = undefined;
        GameSound.Assets.buttonClick = undefined;
    });

    it("sets the button click sound", () => {
        const game = Game.Stub;
        const addAudioSpy = sandbox.spy(game.add, "audio");
        GameSound.setButtonClickSound(game, "test/button-click");
        sinon.assert.calledWith(addAudioSpy, "test/button-click");
    });

    describe("when no music is playing", () => {
        let game;
        let newAudioLoopSpy;
        let addAudioSpy;

        beforeEach(() => {
            game = Game.Stub;
            newAudioLoopSpy = sandbox.spy();
            game.add.audio = () => {
                return {
                    loopFull: newAudioLoopSpy,
                };
            };
            addAudioSpy = sandbox.spy(game.add, "audio");
            const screenConfig = { music: "test/music" };
            GameSound.setupScreenMusic(game, screenConfig);
        });

        it("sets the background music to the asset that matches the provided key", () => {
            sinon.assert.calledOnce(addAudioSpy);
            sinon.assert.calledWith(addAudioSpy, "test/music");
        });

        it("starts the background music playing in a loop", () => {
            sinon.assert.calledOnce(newAudioLoopSpy);
        });

        it("sets the new background music -> starts the new music", () => {
            sinon.assert.callOrder(addAudioSpy, newAudioLoopSpy);
        });
    });

    describe("when background music already exists", () => {
        let game;
        let existingAudioFadeOutSpy;
        let newAudioLoopSpy;
        let newAudioFadeInSpy;
        let addAudioSpy;

        beforeEach(() => {
            game = Game.Stub;
            existingAudioFadeOutSpy = sandbox.spy();
            newAudioFadeInSpy = sandbox.spy();
            GameSound.Assets.backgroundMusic = {
                loopFull: () => {},
                fadeOut: existingAudioFadeOutSpy,
            };
            newAudioLoopSpy = sandbox.spy();
            game.add.audio = () => {
                return {
                    loopFull: newAudioLoopSpy,
                    fadeIn: newAudioFadeInSpy,
                };
            };
            addAudioSpy = sandbox.spy(game.add, "audio");
            const screenConfig = { music: "test/music" };
            GameSound.setupScreenMusic(game, screenConfig);
        });

        it("stops the current background music", () => {
            sinon.assert.calledOnce(existingAudioFadeOutSpy);
        });

        it("sets the background music to the asset that matches the provided key", () => {
            sinon.assert.calledOnce(addAudioSpy);
            sinon.assert.calledWith(addAudioSpy, "test/music");
        });

        it("fades in the new background music and starts it playing in a loop", () => {
            sinon.assert.calledOnce(newAudioFadeInSpy);
            sinon.assert.calledWith(newAudioFadeInSpy, GameSound.SOUND_FADE_PERIOD, true);
        });

        it("fades out the current music -> sets the new background music -> fades the new music in", () => {
            sinon.assert.callOrder(existingAudioFadeOutSpy, addAudioSpy, newAudioFadeInSpy);
        });
    });

    describe("when the SoundManager and device are both using the Audio tag instead of Web Audio", () => {
        let game;

        beforeEach(() => {
            game = Game.Stub;
            game.sound.mute = true;
            game.add.audio = () => {
                return {
                    loopFull: () => {},
                    mute: true,
                    usingAudioTag: true,
                };
            };
            const screenConfig = { music: "test/music" };
            GameSound.setupScreenMusic(game, screenConfig);
        });

        it("sets the mute value of the background music to match the mute value of the game sound", () => {
            expect(GameSound.Assets.backgroundMusic.mute).to.equal(true);
        });
    });

    describe("when the SoundManager and device are both using Web Audio", () => {
        let game;

        beforeEach(() => {
            game = Game.Stub;
            game.sound.mute = true;
            game.add.audio = () => {
                return {
                    loopFull: () => {},
                    mute: false,
                    usingAudioTag: false,
                };
            };
            const screenConfig = { music: "test/music" };
            GameSound.setupScreenMusic(game, screenConfig);
        });

        it("does not change the mute value of the background music", () => {
            expect(GameSound.Assets.backgroundMusic.mute).to.equal(false);
        });
    });

    describe("if there is no music config for the screen", () => {
        let game;
        let addAudioSpy;
        let existingAudioFadeOutSpy;

        beforeEach(() => {
            game = Game.Stub;
            existingAudioFadeOutSpy = sandbox.spy();
            GameSound.Assets.backgroundMusic = {
                loopFull: () => {},
                fadeOut: existingAudioFadeOutSpy,
            };
            addAudioSpy = sandbox.spy(game.add, "audio");
            const screenConfig = {};
            GameSound.setupScreenMusic(game, screenConfig);
        });

        it("will stop the current music", () => {
            sinon.assert.calledOnce(existingAudioFadeOutSpy);
        });

        it("will not try to set new background music", () => {
            sinon.assert.notCalled(addAudioSpy);
        });
    });

    describe("if there is no config of any kind for the screen", () => {
        let game;
        let addAudioSpy;
        let existingAudioFadeOutSpy;

        beforeEach(() => {
            game = Game.Stub;
            existingAudioFadeOutSpy = sandbox.spy();
            GameSound.Assets.backgroundMusic = {
                loopFull: () => {},
                fadeOut: existingAudioFadeOutSpy,
            };
            addAudioSpy = sandbox.spy(game.add, "audio");
            GameSound.setupScreenMusic(game, undefined);
        });

        it("will stop the current music", () => {
            sinon.assert.calledOnce(existingAudioFadeOutSpy);
        });

        it("will not try to set the background music", () => {
            sinon.assert.notCalled(addAudioSpy);
        });
    });
});
