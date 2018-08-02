/* eslint-disable */
var GMI = function(options, embedVars, gameDir) {
    var appName = embedVars.statsAppName;
    var counterName = embedVars.statsCounterName;
    var gameId = "local-id";
    var containerId = "local-game-holder";
    var url = "";
    var env = "test";
    Object.defineProperty(GMI.prototype, "embedVars", {
        get: function() {
            return embedVars;
        },
    });
    Object.defineProperty(GMI.prototype, "gameContainerId", {
        get: function() {
            return containerId;
        },
    });
    Object.defineProperty(GMI.prototype, "gameUrl", {
        get: function() {
            return url;
        },
    });
    Object.defineProperty(GMI.prototype, "gameDir", {
        get: function() {
            return gameDir;
        },
    });
    Object.defineProperty(GMI.prototype, "environment", {
        get: function() {
            return env;
        },
    });
    Object.defineProperty(GMI.prototype, "shouldShowExitButton", {
        get: function() {
            return window.self === window.top;
        },
    });
    Object.defineProperty(GMI.prototype, "shouldDisplayMuteButton", {
        get: function() {
            return true;
        },
    });
    Object.defineProperty(GMI.prototype, "shouldLongPressForSettings", {
        get: function() {
            return false;
        },
    });

    var GMI_LOCAL_STORAGE_KEY = "bbc_childrens_gmi_data";
    var GMI_GAME_STORAGE_KEY = GMI_LOCAL_STORAGE_KEY + "_" + gameId;
    var globalSettings = {
        audio: true,
        subtitles: false,
        motion: true,
    };
    var gameSettings = {};
    function areCookiesAllowed() {
        return true;
    }
    function parseLocalStorage(key) {
        var data = window.localStorage.getItem(key);
        try {
            return JSON.parse(data);
        } catch (e) {}
        return undefined;
    }
    function loadLocalData() {
        function getDefaultSettings() {
            var defaults = {};
            defaults.audio = true;
            defaults.subtitles = false;
            defaults.motion = true;
            return defaults;
        }
        function ensureGlobalSettingsAreBools() {
            globalSettings.audio = !!globalSettings.audio;
            globalSettings.subtitles = !!globalSettings.subtitles;
            globalSettings.motion = !globalSettings.hasOwnProperty("motion") || globalSettings.motion;
        }
        if (areCookiesAllowed()) {
            globalSettings = parseLocalStorage(GMI_LOCAL_STORAGE_KEY) || getDefaultSettings();
            ensureGlobalSettingsAreBools();
            gameSettings = parseLocalStorage(GMI_GAME_STORAGE_KEY) || {};
        } else {
            return getDefaultSettings();
        }
    }
    function saveGlobalSettings() {
        if (areCookiesAllowed()) {
            try {
                window.localStorage.setItem(GMI_LOCAL_STORAGE_KEY, JSON.stringify(globalSettings));
            } catch (e) {}
        }
    }
    GMI.prototype.getAllSettings = function() {
        var settings = JSON.parse(JSON.stringify(globalSettings)); //Prevents reference assignment
        if (areCookiesAllowed()) {
            settings.gameData = gameSettings;
        }
        return settings;
    };
    GMI.prototype.setGameData = function(key, value) {
        if (areCookiesAllowed()) {
            gameSettings[key] = value;
            // In Safari Private browsing mode on OSX and iOS localStorage in read only, and will throw
            // QuotaExceededError if an attempt to call setItem is made
            try {
                window.localStorage.setItem(GMI_GAME_STORAGE_KEY, JSON.stringify(gameSettings));
            } catch (e) {}
        }
    };
    GMI.prototype.setAudio = function(state) {
        globalSettings.audio = !!state;
        saveGlobalSettings();
    };
    GMI.prototype.setSubtitles = function(state) {
        globalSettings.subtitles = !!state;
        saveGlobalSettings();
    };
    GMI.prototype.setMotion = function(state) {
        globalSettings.motion = !!state;
        saveGlobalSettings();
    };
    GMI.prototype.showPrompt = function(resumeGame) {
        resumeGame();
        return false;
    };
    GMI.prototype.showSettings = function() {
        return true;
    };
    GMI.prototype.sendStatsEvent = function(name, type, params) {
        console.log("Stat fired - name: " + name + ", type: " + type + ", params: " + JSON.stringify(params));
    };
    GMI.prototype.exit = function() {
        window.open("http://www.bbc.co.uk", "_top");
    };
    GMI.prototype.debug = function(message) {
        console.log(message);
    };
    GMI.prototype.gameLoaded = function() {};
    loadLocalData();
    GMI.prototype = Object.create(GMI.prototype);
};

function configureGmi(gameDir, themesDir) {
    var gmi_instance;
    var theme = getParam("theme") || "default";
    var embedVars = {
        statsCounterName: "testCounterName",
        statsAppName: "TestAppName",
        configPath: themesDir + theme + "/config.json",
    };

    window.getGMI = function(options) {
        if (gmi_instance) {
            console.warn("Attempted to create multiple copies of the GMI. Only a single instance should be created");
        }
        gmi_instance = new GMI(options, embedVars, gameDir);
        return gmi_instance;
    };
}

function getParam(name) {
    var re = new RegExp(name + "=([^&]*)", "g");
    var match = re.exec(document.location.search);
    return match ? match[1] : null;
}

configureGmi("", "themes/");