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

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

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
            var cssMap = this.collect();
            var spriteMap = this.pack(cssMap);

            console.log(spriteMap);

            // return this.process(map)
        }
    }, {
        key: 'collect',
        value: function collect() {
            var store = this.store;


            this._getResource().forEach(function (subpath) {
                var realpath = _io2.default.realpath(subpath);
                var content = _io2.default.read(realpath);
                var stamp = content.length;

                store.add({
                    subpath: subpath,
                    realpath: realpath,
                    content: content,
                    stamp: stamp
                }, 'STYLE');
            });

            return _css2.default.badge(store.styles);
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
                        var content = _io2.default.read(imageRealpath, 'buffer');

                        if (!content) {
                            _log2.default.error('`' + url + '` not found');
                            return ret;
                        }

                        var subpath = _io2.default.subpath(realpath);
                        var stamp = content.length;

                        store.add({
                            subpath: subpath,
                            realpath: realpath,
                            content: content,
                            stamp: stamp,
                            url: url
                        }, 'IMAGE');

                        ret[tag] = ret[tag] || [];
                        ret[tag].indexOf(imageRealpath) === -1 && ret[tag].push(imageRealpath);
                    });

                    return ret;
                }, ret);
            }, {});
        }
    }, {
        key: 'process',
        value: function process() {
            this._buildSprite();
            this._outputSprite();
            this._outputStyle();
        }
    }, {
        key: '_buildSprite',
        value: function _buildSprite() {
            var opt = this.options;

            _sprite2.default.build(opt, function (sp) {
                var path = _lodash2.default.join(opt.output, opt.prefix + sp.tag + '.png');
                var content = new Buffer(sp.image);

                File.wrap({
                    path: path,
                    content: content,
                    id: sp.tag,
                    sprite: sp,
                    type: 'SPRITE',
                    meta: {
                        width: sp.properties.width,
                        height: sp.properties.height,
                        coordinates: sp.coordinates
                    }
                });
            });
        }
    }, {
        key: '_outputSprite',
        value: function _outputSprite() {
            var _this = this;

            var sprites = _store2.default.sprite;
            _lodash2.default.forIn(sprites, function (file) {
                return _this.outputSprite(file);
            });
        }
    }, {
        key: '_outputStyle',
        value: function _outputStyle() {
            var processor = (0, _postcss2.default)();
            var styles = _store2.default.styles;
            // css.process
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(file) {
            var opt = this.options;
            var name = _lodash2.default.basename(file.realpath);
            var outputPath = _lodash2.default.join(opt.dest, name);
            var outputRealpath = _lodash2.default.resolve(outputPath);

            if (_lodash2.default.exists(outputRealpath)) {
                outputPath = _lodash2.default.join(opt.dest, name);
                outputRealpath = _lodash2.default.resolve(outputPath);
            }

            _fsExtra2.default.outputFileSync(outputRealpath, file.content, 'utf8');
            _log2.default.build(outputPath);
        }
    }, {
        key: 'outputSprite',
        value: function outputSprite(file) {
            var opt = this.options;
            var name = file.id;
            var outputPath = _lodash2.default.resolve(opt.output, name + '.png');

            _fsExtra2.default.outputFileSync(outputPath, file.content, 'binary');
            _log2.default.build(file.path);
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