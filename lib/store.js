'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Cache = {};

var Storage = function () {
    function Storage() {
        (0, _classCallCheck3.default)(this, Storage);

        this.storage = {
            style: {},
            image: {},
            sprite: {}
        };
    }

    (0, _createClass3.default)(Storage, [{
        key: 'add',
        value: function add(file) {
            var unique = arguments.length <= 1 || arguments[1] === undefined ? 'realpath' : arguments[1];

            var t = file.type.toLowerCase();
            return this.storage[t] && (this.storage[t][file[unique]] = file);
        }
    }, {
        key: 'get',
        value: function get(unique) {
            return this.storage.sprite[unique] || this.storage.style[unique] || this.storage.image[unique] || null;
        }
    }, {
        key: 'styles',
        get: function get() {
            return this.storage.style;
        }
    }, {
        key: 'images',
        get: function get() {
            return this.storage.image;
        }
    }, {
        key: 'sprites',
        get: function get() {
            return this.storage.sprite;
        }
    }]);
    return Storage;
}();

exports.default = {
    create: function create() {
        return new Storage();
    },
    cache: function cache(file, unique) {
        Cache[file[unique]] = file;
    },
    fromCache: function fromCache(unique) {
        return Cache[unique] || null;
    }
};