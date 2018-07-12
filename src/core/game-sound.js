const Assets = {
    newMusic: undefined,
    currentMusic: undefined,
    buttonClick: undefined,
};

const SOUND_FADE_PERIOD = 1000;

const setButtonClickSound = (game, audioKey) => {
    Assets.buttonClick = game.add.audio(audioKey);
};

const setupScreenMusic = (game, themeScreenConfig) => {
    stopCurrentMusic(game);

    Assets.currentMusic = Assets.newMusic;

    if (!themeScreenConfig || !themeScreenConfig.hasOwnProperty("music")) {
        stopCurrentMusic(game);
        Assets.newMusic = undefined;
        return;
    }

    const audioKey = themeScreenConfig.music;
    setNewMusic(game, audioKey);

    if (Assets.newMusic.usingAudioTag) {
        Assets.newMusic.mute = game.sound.mute;
    }
};

const setNewMusic = (game, audioKey) => {
    if (Assets.newMusic) {
        if (Assets.newMusic.name !== audioKey) {
            Assets.newMusic = game.add.audio(audioKey);
            Assets.newMusic.fadeIn(SOUND_FADE_PERIOD, true);
        }
    } else {
        // This apparently duplicate line is to fix a problem with Phaser not
        // starting music when the first Genie screen loads.
        Assets.newMusic = game.add.audio(audioKey);
        Assets.newMusic.loopFull();
    }
};

const stopCurrentMusic = game => {
    if (Assets.currentMusic) {
        Assets.currentMusic.onFadeComplete.addOnce(() => {
            game.sound.remove(Assets.currentMusic);
        });
        Assets.currentMusic.fadeOut(SOUND_FADE_PERIOD / 2);
    }
};

export { Assets, setButtonClickSound, setupScreenMusic, SOUND_FADE_PERIOD };
