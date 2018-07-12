import * as sinon from "sinon";
import { expect } from "chai";
import * as GameSound from "../../src/core/game-sound.js";
import * as Game from "../fake/game.js";
import * as PhaserSignal from "../fake/phaser-signal.js";

describe("Game Sound", () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
        GameSound.Assets.newMusic = undefined;
        GameSound.Assets.buttonClick = undefined;
        GameSound.Assets.currentMusic = undefined;
    });

    describe("#setButtonClickSound", () => {
        it("sets the button click sound", () => {
            const game = Game.Stub;
            const addAudioSpy = sandbox.spy(game.add, "audio");
            GameSound.setButtonClickSound(game, "test/button-click");
            sinon.assert.calledWith(addAudioSpy, "test/button-click");
        });
    });

    describe("#setupScreenMusic", () => {
        describe("when no music is playing", () => {
            let game;
            let newMusicLoopSpy;
            let addAudioSpy;

            beforeEach(() => {
                game = Game.Stub;
                newMusicLoopSpy = sandbox.spy();
                game.add.audio = () => {
                    return {
                        loopFull: newMusicLoopSpy,
                    };
                };
                addAudioSpy = sandbox.spy(game.add, "audio");
                const screenConfig = { music: "test/music" };
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("adds the new music audio matching the asset key provided", () => {
                sinon.assert.calledOnce(addAudioSpy);
                sinon.assert.calledWith(addAudioSpy, "test/music");
            });

            it("starts the new music playing in a loop", () => {
                sinon.assert.calledOnce(newMusicLoopSpy);
            });

            it("adds the new music audio -> starts the new music", () => {
                sinon.assert.callOrder(addAudioSpy, newMusicLoopSpy);
            });
        });

        describe("when the current music does not have the same asset name as the new music", () => {
            let game;
            let currentMusicFadeOutSpy;
            let newMusicLoopSpy;
            let newMusicFadeInSpy;
            let addAudioSpy;

            beforeEach(() => {
                game = Game.Stub;
                currentMusicFadeOutSpy = sandbox.spy();
                newMusicFadeInSpy = sandbox.spy();
                GameSound.Assets.currentMusic = {
                    loopFull: () => {},
                    fadeOut: currentMusicFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                    name: "current-music",
                };
                GameSound.Assets.newMusic = {
                    loopFull: () => {},
                    fadeOut: currentMusicFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                    name: "new-music",
                };
                newMusicLoopSpy = sandbox.spy();
                game.add.audio = () => {
                    return {
                        loopFull: newMusicLoopSpy,
                        fadeIn: newMusicFadeInSpy,
                    };
                };
                addAudioSpy = sandbox.spy(game.add, "audio");
                const screenConfig = { music: "test/music" };
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("fades out the current music", () => {
                sinon.assert.calledOnce(currentMusicFadeOutSpy);
                sinon.assert.calledWith(currentMusicFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });

            it("sets the new music to the asset that matches the provided key", () => {
                sinon.assert.calledOnce(addAudioSpy);
                sinon.assert.calledWith(addAudioSpy, "test/music");
            });

            it("fades in the new music and starts it playing in a loop", () => {
                sinon.assert.calledOnce(newMusicFadeInSpy);
                sinon.assert.calledWith(newMusicFadeInSpy, GameSound.SOUND_FADE_PERIOD, true);
            });

            it("fades out the current music -> sets the new music -> fades in the new music", () => {
                sinon.assert.callOrder(currentMusicFadeOutSpy, addAudioSpy, newMusicFadeInSpy);
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

            it("sets the mute value of the new music to match the mute value of the game sound", () => {
                expect(GameSound.Assets.newMusic.mute).to.equal(true);
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

            it("does not change the mute value of the new music", () => {
                expect(GameSound.Assets.newMusic.mute).to.equal(false);
            });
        });

        describe("if there is no music config for the screen", () => {
            let game;
            let addAudioSpy;
            let currentMusicFadeOutSpy;

            beforeEach(() => {
                game = Game.Stub;
                currentMusicFadeOutSpy = sandbox.spy();
                GameSound.Assets.currentMusic = {
                    loopFull: () => {},
                    fadeOut: currentMusicFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                };
                addAudioSpy = sandbox.spy(game.add, "audio");
                const screenConfig = {};
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("will fade out the current music", () => {
                sinon.assert.calledOnce(currentMusicFadeOutSpy);
                sinon.assert.calledWith(currentMusicFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });

            it("will not try to add new music", () => {
                sinon.assert.notCalled(addAudioSpy);
            });
        });

        describe("if there is no config of any kind for the screen", () => {
            let game;
            let addAudioSpy;
            let currentMusicFadeOutSpy;

            beforeEach(() => {
                game = Game.Stub;
                currentMusicFadeOutSpy = sandbox.spy();
                GameSound.Assets.newMusic = {
                    loopFull: () => {},
                    fadeOut: currentMusicFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                };
                addAudioSpy = sandbox.spy(game.add, "audio");
                GameSound.setupScreenMusic(game, undefined);
            });

            it("will fade out the current music", () => {
                sinon.assert.calledOnce(currentMusicFadeOutSpy);
                sinon.assert.calledWith(currentMusicFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });

            it("will not try to add new music", () => {
                sinon.assert.notCalled(addAudioSpy);
            });
        });
    });
});
