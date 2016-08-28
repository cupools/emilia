'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

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
            prefix: '',
            algorithm: 'binary-tree',
            padding: 10,
            unit: 'px',
            convert: 1,
            decimal: 6,
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


            if (!(0, _lint2.default)(options)) {
                return false;
            }

            this.collect();
            var cssMap = _css2.default.badge(store);
            var spriteMap = this.pack(cssMap);

            this.process(spriteMap);
            _css2.default.process(store, options);

            this.output();
        }
    }, {
        key: 'collect',
        value: function collect() {
            var store = this.store;
            var options = this.options;
            var dest = options.dest;


            this._getResource().forEach(function (subpath) {
                // TODO
                var realpath = _io2.default.realpath(subpath);
                var style = new _file.Style(realpath, {
                    dest: dest
                });
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
                        // TODO
                        var imageRealpath = _path2.default.resolve(realpath, '..', url);
                        var image = new _file.Image(imageRealpath, url);

                        if (!image.content) {
                            _log2.default.error('`' + url + '` not found');
                            return;
                        }

                        store.add(image);

                        ret[tag] = ret[tag] || [];
                        ret[tag].filter(function (item) {
                            return item.realpath === image.realpath;
                        }).length === 0 && ret[tag].push(image);
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
                var old = _store2.default.fromCache(tag, 'tag');
                if (old && old.equal(sprite)) {
                    sprite.coordinates = old.coordinates;
                    sprite.properties = old.properties;
                    sprite.content = old.content;
                } else {
                    sprite.build();
                }

                store.add(sprite, 'tag');
                _store2.default.cache(sprite, 'tag');
            });
        }
    }, {
        key: 'output',
        value: function output() {
            var store = this.store;

            (0, _keys2.default)(store.styles).forEach(function (f) {
                return store.styles[f].save();
            });
            (0, _keys2.default)(store.sprites).forEach(function (f) {
                return store.sprites[f].save();
            });
        }
    }, {
        key: '_getResource',
        value: function _getResource() {
            var src = this.options.src;

            var styles = src.reduce(function (ret, pattern) {
                var map = _glob2.default.sync(pattern);

                if (map.length) {
                    ret.push.apply(ret, (0, _toConsumableArray3.default)(map));
                }

                return ret;
            }, []);

            return [].concat((0, _toConsumableArray3.default)(new _set2.default(styles)));
        }
    }]);
    return Emilia;
}();

exports.default = Emilia;