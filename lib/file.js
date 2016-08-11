"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var File = function File(attr) {
    (0, _classCallCheck3.default)(this, File);

    attr.id = attr.id || attr.realpath;
    (0, _assign2.default)(this, attr);
};

var ctl = {
    storage: {
        style: {},
        sprite: {}
    },
    wrap: function wrap(params) {
        var f = new File(params);
        var type = f.type.toLowerCase();
        var id = f.id;

        this.storage[type][id] = f;

        return f;
    },
    getFile: function getFile(id) {
        return this.storage.style[id] || this.storage.sprite[id];
    },
    getStyles: function getStyles() {
        return this.storage.style;
    },
    getSprites: function getSprites() {
        return this.storage.sprite;
    },
    clear: function clear() {
        this.storage.style = {};
        this.storage.sprite = {};
    }
};

exports.default = ctl;