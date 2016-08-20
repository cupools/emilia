"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cache = {};
var Storage = {
    storage: {
        style: {},
        image: {},
        sprite: {}
    },
    add: function add(file) {
        var t = file.type.toLowerCase();
        return this.storage[t] && (this.storage[t][file.realpath] = file);
    },
    get: function get(realpath) {
        return this.storage.sprite[realpath] || this.storage.style[realpath] || this.storage.image[realpath] || null;
    },

    get styles() {
        return this.storage.style;
    },
    get images() {
        return this.storage.image;
    },
    get sprites() {
        return this.storage.sprite;
    }
};

exports.default = {
    create: function create() {
        return (0, _assign2.default)({}, Storage);
    },
    cache: function cache(file) {
        Cache[file.realpath] = file;
    },
    fromCache: function fromCache(realpath) {
        return Cache[realpath] || null;
    }
};