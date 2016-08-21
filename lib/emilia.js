'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _file = require('./file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Emilia = function () {
    function Emilia(options) {
        (0, _classCallCheck3.default)(this, Emilia);

        this.options = (0, _assign2.default)({
            src: ['**/*.css'],
            dest: 'build/css/',
            output: 'build/images/',
            cssPath: '../images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            unit: 'px',
            convert: 1,
            quiet: false
        }, options);

        this.store = _store2.default.create();
        _log2.default.trigger(this.options.quiet);
    }

    (0, _createClass3.default)(Emilia, [{
        key: 'run',
        value: function run() {
            var store = this.store;
            var options = this.options;


            this.collect();
            var cssMap = _css2.default.badge(store);
            var spriteMap = this.pack(cssMap);

            this.process(spriteMap);
            _css2.default.process(store, options);
        }
    }, {
        key: 'collect',
        value: function collect() {
            var store = this.store;


            this._getResource().forEach(function (subpath) {
                var realpath = _io2.default.realpath(subpath);
                var style = new _file.Style(realpath);
                store.add(style);
            });
        }
    }, {
        key: 'pack',
        value: function pack(cssMap) {
            var store = this.store;


            return (0, _keys2.default)(cssMap).reduce(function (ret, realpath) {
                var tags = cssMap[realpath];
                return (0, _keys2.default)(tags).reduce(function (ret, tag) {
                    var urls = tags[tag];
                    urls.forEach(function (url) {
                        var imageRealpath = _path2.default.resolve(realpath, '..', url);
                        var image = new _file.Image(imageRealpath, url);

                        if (!image.content) {
                            _log2.default.error('`' + url + '` not found');
                            return;
                        }

                        store.add(image);

                        ret[tag] = ret[tag] || [];
                        ret[tag].indexOf(image) === -1 && ret[tag].push(image);
                    });

                    return ret;
                }, ret);
            }, {});
        }
    }, {
        key: 'process',
        value: function process(spriteMap) {
            var _options = this.options;
            var dest = _options.dest;
            var prefix = _options.prefix;
            var padding = _options.padding;
            var algorithm = _options.algorithm;
            var cssPath = _options.cssPath;
            var store = this.store;


            (0, _keys2.default)(spriteMap).forEach(function (tag) {
                var dependence = spriteMap[tag];
                var basename = prefix + tag + '.png';
                var realpath = _path2.default.resolve(dest, basename);

                var sprite = new _file.Sprite(realpath, tag, dependence, {
                    padding: padding,
                    algorithm: algorithm,
                    cssPath: cssPath
                });

                // cache only sprite
                var old = _store2.default.fromCache(realpath);
                if (old && old.stamp === sprite.stamp) {
                    store.add(old);
                } else {
                    sprite.build();
                    store.add(sprite, 'tag');
                    _store2.default.cache(sprite, 'tag');
                }
            });
        }
    }, {
        key: '_getResource',
        value: function _getResource() {
            var src = this.options.src;

            var styles = src.reduce(function (ret, pattern) {
                return ret.push.apply(ret, (0, _toConsumableArray3.default)(_glob2.default.sync(pattern))) && ret;
            }, []);

            return _lodash2.default.uniq(styles);
        }
    }]);
    return Emilia;
}();

exports.default = Emilia;