'use strict';

module.exports = {
    //plugins: ['plugins/markdown']
    "source": {
        "include": ["./src", "./README.md", './package.json'],
        "exclude": ["./src/lib"],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "sourceType": "module",
    "applicationName": "Genie",
    "opts": {
        //"template": "./node_modules/@freshes/jsdoc-template",
        //"template": "./node_modules/jaguarjs-jsdoc",
        //"template": "node_modules/minami",
        "recurse": true,
        "destination": "./docs/jsdoc",
    },
    "templates": {
        "default": {
            "layoutFile": "./docs/template/layout.tmpl"
        }
    }
};
