'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

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
        var unique = arguments.length <= 1 || arguments[1] === undefined ? 'realpath' : arguments[1];

        var t = file.type.toLowerCase();
        return this.storage[t] && (this.storage[t][file[unique]] = file);
    },
    get: function get(unique) {
        return this.storage.sprite[unique] || this.storage.style[unique] || this.storage.image[unique] || null;
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
        var unique = arguments.length <= 1 || arguments[1] === undefined ? 'realpath' : arguments[1];

        Cache[file[unique]] = file;
    },
    fromCache: function fromCache(unique) {
        return Cache[unique] || null;
    }
};