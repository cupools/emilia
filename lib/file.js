'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var asserts = {
    style: {},
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
    return asserts.style[id] || asserts.sprite[id];
}

function getStyles() {
    return asserts.style;
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
exports.getSprites = getSprites;
exports.getFile = getFile;