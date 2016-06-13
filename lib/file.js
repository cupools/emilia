'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFile = exports.getSprites = exports.getImages = exports.getStyles = exports.wrap = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var asserts = {
    style: {},
    image: {},
    sprite: {}
};

var File = function File(attr) {
    _classCallCheck(this, File);

    attr.id = attr.id || identity();
    Object.assign(this, attr);
};

function wrap(params) {
    var f = new File(params);
    var type = f.type.toLowerCase();
    var id = f.id;

    asserts[type][id] = f;

    return f;
}

function getFile(id) {
    return asserts.style[id] || asserts.image[id] || asserts.sprite[id];
}

function getStyles() {
    return asserts.style;
}

function getImages() {
    return asserts.image;
}

function getSprites() {
    return asserts.sprite;
}

function identity() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    }).toUpperCase();
}

exports.wrap = wrap;
exports.getStyles = getStyles;
exports.getImages = getImages;
exports.getSprites = getSprites;
exports.getFile = getFile;