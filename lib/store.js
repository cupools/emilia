"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Storage = {
    storage: {
        style: {},
        image: {}
    },
    add: function add(item, type) {
        var t = type.toLowerCase();
        return this.storage[t] && (this.storage[t][item.realpath] = item);
    },
    get: function get(realpath) {
        return this.storage.style[realpath] || this.storage.image[realpath] || null;
    },

    get styles() {
        return this.storage.style;
    },
    get images() {
        return this.storage.image;
    }
};

exports.default = {
    create: function create() {
        return (0, _assign2.default)({}, Storage);
    }
};