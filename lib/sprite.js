'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var asserts = {};
var cache = {};

var Sprite = function () {
    function Sprite(tag) {
        _classCallCheck(this, Sprite);

        this.tag = tag;
        this.dependences = [];
        this.properties = null;
        this.coordinates = null;
        this.image = null;
        this.stamp = '';
    }

    _createClass(Sprite, [{
        key: 'add',
        value: function add(realpath, stamp) {
            if (this.dependences.indexOf(realpath) === -1) {
                this.dependences.push(realpath);
                this.mark(stamp);
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


            Object.assign(this, {
                properties: properties,
                coordinates: coordinates,
                image: image
            });
        }
    }, {
        key: 'equal',
        value: function equal(obj) {
            return obj && this.tag === obj.tag && this.stamp === obj.stamp;
        }
    }, {
        key: 'mark',
        value: function mark(stamp) {
            this.stamp += stamp;
        }
    }]);

    return Sprite;
}();

function processSprite(_ref) {
    var tag = _ref.tag;
    var sprites = _ref.sprites;
    var options = _ref.options;

    var ret = _child_process2.default.spawnSync('node', [_util2.default.join(__dirname, 'spritesmith.js'), '-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)], {
        encoding: 'utf8'
    });
    var result = JSON.parse(ret.stdout.toString());

    return result;
}

function shouldRebuild() {
    var ret = false;

    _util2.default.forIn(asserts, function (sprite, tag) {
        var old = cache[tag];

        if (!old || !sprite.equal(old)) {
            ret = true;
            return false;
        }
    });

    return ret;
}

exports.default = {
    build: function build(opt, callback) {
        if (shouldRebuild()) {
            _util2.default.forIn(asserts, function (sprite) {
                sprite.process(opt);
            });
        } else {
            asserts = cache;
            cache = {};
        }

        _util2.default.forIn(asserts, function (sprite) {
            callback(sprite);
        });
    },
    add: function add(tag, realpath, stamp) {
        if (!asserts[tag]) {
            asserts[tag] = new Sprite(tag);
        }

        asserts[tag].add(realpath, stamp);
    },
    get: function get(tag) {
        return tag ? asserts[tag] : asserts;
    },
    save: function save() {
        cache = asserts;
        this.clear();
    },
    clear: function clear() {
        asserts = {};
    }
};