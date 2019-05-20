/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import "jest-canvas-mock";

// global.Phaser = {
//     Sprite: function() {},
//     Group: function() {},
//     Button: function() {},
//     Signal: function() {
//         var listener;
//         // NOTE: this is different from actual implementation
//         // supports only one handler
//         this.addOnce = this.add = function(cb) {
//             listener = cb;
//         };
//         this.dispatch = function() {
//             if (listener) {
//                 listener();
//             }
//         };
//     },
// };

// import phaser from "phaser-ce";
const p2 = require("../../node_modules/phaser-ce/build/custom/p2.js");
global.p2 = p2;
const PIXI = require("../../node_modules/phaser-ce/build/custom/pixi.js");
global.PIXI = PIXI;
const phaserSplit = require("../../node_modules/phaser-ce/build/custom/phaser-split.js");
global.Phaser = phaserSplit;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const documentHTML = "<!doctype html><html><body><div id='root'></div></body></html>";
global.document = new JSDOM(documentHTML);
