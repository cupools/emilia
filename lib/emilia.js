'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlReg = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/;
var replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/;
var declFilter = /(-webkit-)?background-(size|repeat)/;
var inlineTag = 'inline';

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

        this.File = _file2.default;
        _log2.default.trigger(this.options.quiet);
    }

    (0, _createClass3.default)(Emilia, [{
        key: 'run',
        value: function run() {
            this.collect();
            this.process();
        }
    }, {
        key: 'collect',
        value: function collect() {
            _file2.default.clear();
            _sprite2.default.save();
            this._initStyle();
            // css.badge()
        }
    }, {
        key: 'process',
        value: function process() {
            this._buildSprite();
            this._outputSprite();
            this._outputStyle();
        }
    }, {
        key: '_initStyle',
        value: function _initStyle() {
            this._getResource().forEach(function (p) {
                // let f = this.initStyle(p)
            });
        }
    }, {
        key: 'initStyle',
        value: function initStyle(path) {
            var realpath = _util2.default.resolve(path);

            return _file2.default.wrap({
                path: path,
                realpath: realpath,
                type: 'STYLE',
                content: _fsExtra2.default.readFileSync(realpath, 'utf8')
            });
        }
    }, {
        key: '_buildSprite',
        value: function _buildSprite() {
            var opt = this.options;

            _sprite2.default.build(opt, function (sp) {
                var path = _util2.default.join(opt.output, opt.prefix + sp.tag + '.png');
                var content = new Buffer(sp.image);

                _file2.default.wrap({
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

            var sprites = _file2.default.getSprites();
            _util2.default.forIn(sprites, function (file) {
                return _this.outputSprite(file);
            });
        }
    }, {
        key: '_outputStyle',
        value: function _outputStyle() {
            var processor = (0, _postcss2.default)();
            var styles = _file2.default.getStyles();

            // css.process
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(file) {
            var opt = this.options;
            var name = _util2.default.basename(file.realpath);
            var outputPath = _util2.default.join(opt.dest, name);
            var outputRealpath = _util2.default.resolve(outputPath);

            if (_util2.default.exists(outputRealpath)) {
                outputPath = _util2.default.join(opt.dest, name);
                outputRealpath = _util2.default.resolve(outputPath);
            }

            _fsExtra2.default.outputFileSync(outputRealpath, file.content, 'utf8');
            _log2.default.build(outputPath);
        }
    }, {
        key: 'outputSprite',
        value: function outputSprite(file) {
            var opt = this.options;
            var name = file.id;
            var outputPath = _util2.default.resolve(opt.output, name + '.png');

            _fsExtra2.default.outputFileSync(outputPath, file.content, 'binary');
            _log2.default.build(file.path);
        }
    }, {
        key: '_getImageRealpath',
        value: function _getImageRealpath(url, stylePath) {
            return _util2.default.join(stylePath, '../', url);
        }
    }, {
        key: '_getResource',
        value: function _getResource() {
            var styles = [];
            var src = this.options.src;


            src.forEach(function (f) {
                styles.push.apply(styles, (0, _toConsumableArray3.default)(_glob2.default.sync(f)));
            });

            return _util2.default.uniq(styles);
        }
    }, {
        key: '_encode',
        value: function _encode(realpath) {
            var base64 = _fsExtra2.default.readFileSync(realpath, {
                encoding: 'base64'
            });
            return 'data:image/png;base64,' + base64;
        }
    }]);
    return Emilia;
}();

exports.default = Emilia;