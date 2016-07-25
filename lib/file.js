"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var File = function File(attr) {
    _classCallCheck(this, File);

    attr.id = attr.id || attr.realpath;
    Object.assign(this, attr);
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