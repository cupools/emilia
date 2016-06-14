'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = exports.add = exports.build = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var storage = {};

var Sprite = function () {
    function Sprite(tag) {
        _classCallCheck(this, Sprite);

        this.tag = tag;
        this.dependences = [];
        this.properties = null;
        this.coordinates = null;
        this.image = null;
    }

    _createClass(Sprite, [{
        key: 'add',
        value: function add(realpath) {
            if (this.dependences.indexOf(realpath) === -1) {
                this.dependences.push(realpath);
            }
        }
    }, {
        key: 'process',
        value: function process(options) {
            var _processSprite = processSprite({
                options: options,
                tag: this.tag,
                sprites: this.dependences
            });

            var properties = _processSprite.properties;
            var coordinates = _processSprite.coordinates;
            var image = _processSprite.image;


            Object.assign(this, { properties: properties, coordinates: coordinates, image: image });
        }
    }]);

    return Sprite;
}();

function processSprite(_ref) {
    var tag = _ref.tag;
    var sprites = _ref.sprites;
    var options = _ref.options;

    var ret = _child_process2.default.execFileSync(_path2.default.join(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)]);
    var result = JSON.parse(ret.toString());
    storage[tag] = result;

    return result;
}

function build(opt, callback) {
    _util2.default.forIn(storage, function (sprite) {
        sprite.process(opt);
        callback(sprite);
    });
}

function add(realpath, tag) {
    if (!storage[tag]) {
        storage[tag] = new Sprite(tag);
    }

    storage[tag].add(realpath);
}

function get(tag) {
    return tag ? storage[tag] : storage;
}

exports.build = build;
exports.add = add;
exports.get = get;