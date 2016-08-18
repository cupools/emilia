'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asserts = {};
var cache = {};

var Sprite = function () {
    function Sprite(tag) {
        (0, _classCallCheck3.default)(this, Sprite);

        this.tag = tag;
        this.dependences = [];
        this.properties = null;
        this.coordinates = null;
        this.image = null;
        this.stamp = '';
    }

    // read picture and return operation result


    (0, _createClass3.default)(Sprite, [{
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


            (0, _assign2.default)(this, {
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

    return _image2.default.process(sprites, options);
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