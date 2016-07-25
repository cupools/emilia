'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var urlReg = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/;
var replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/;
var declFilter = /(-webkit-)?background-(size|repeat)/;
var inlineTag = 'inline';

var Emilia = function () {
    function Emilia(options) {
        _classCallCheck(this, Emilia);

        this.options = Object.assign({
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

    _createClass(Emilia, [{
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
            var _this = this;

            this._getResource().map(function (p) {
                var f = _this.initStyle(p);
                _this._handleStyle(f);
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
        key: '_handleStyle',
        value: function _handleStyle(file) {
            var processor = (0, _postcss2.default)();
            processor.use(this._walkDecls.bind(this, file));
            file.content = processor.process(file.content).css;
        }
    }, {
        key: '_walkDecls',
        value: function _walkDecls(file, css) {
            var _this2 = this;

            css.walkDecls(this._traverseFilter(file, function (decl, file, group) {
                var url = group[1];
                var tag = group[3];
                var realpath = _this2._getImageRealpath(url, file.realpath);
                var stat = _util2.default.statSync(realpath);

                if (stat) {
                    if (tag !== inlineTag) {
                        _sprite2.default.add(tag, realpath, stat.mtime);
                    }
                } else {
                    decl.value = decl.value.replace(/\?__\w+/, '');
                    _log2.default.warn(url + ' not exists');
                }
            }));
        }
    }, {
        key: '_traverseFilter',
        value: function _traverseFilter(file, callback) {
            return function (decl) {
                if (decl.prop.indexOf('background') !== -1) {
                    var group = urlReg.exec(decl.value);

                    if (group && group[2]) {
                        callback(decl, file, group);
                    }
                }
            };
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
            var _this3 = this;

            var sprites = _file2.default.getSprites();
            _util2.default.forIn(sprites, function (file) {
                return _this3.outputSprite(file);
            });
        }
    }, {
        key: '_outputStyle',
        value: function _outputStyle() {
            var _this4 = this;

            var processor = (0, _postcss2.default)();
            var styles = _file2.default.getStyles();

            _util2.default.forIn(styles, function (file) {
                processor.use(_this4._updateDecls.bind(_this4, file));
                file.content = processor.process(file.content).css;

                _this4.outputStyle(file);
            });
        }
    }, {
        key: '_updateDecls',
        value: function _updateDecls(file, css) {
            var _this5 = this;

            var opt = this.options;

            css.walkDecls(this._traverseFilter(file, function (decl, file, group) {
                var url = group[1];
                var tag = group[3];
                var realpath = _this5._getImageRealpath(url, file.realpath);

                if (tag === inlineTag) {
                    var encode = _this5._encode(realpath);
                    decl.value = decl.value.replace(replaceUrlReg, '$1' + encode + '$3');
                    return;
                }

                var sprite = _file2.default.getFile(tag);
                var meta = sprite.meta;
                var chip = meta.coordinates[realpath];
                var pos = _postcss2.default.decl({
                    prop: 'background-position',
                    value: '' + -chip.x / opt.convert + opt.unit + ' ' + -chip.y / opt.convert + opt.unit
                });
                var size = _postcss2.default.decl({
                    prop: 'background-size',
                    value: '' + meta.width / opt.convert + opt.unit + ' ' + meta.height / opt.convert + opt.unit
                });

                url = sprite.url || '' + opt.cssPath + opt.prefix + tag + '.png';
                decl.value = decl.value.replace(urlReg, 'url(' + url + ')');

                var parent = decl.parent;

                parent.walkDecls(function (decl) {
                    if (declFilter.test(decl.prop)) {
                        decl.remove();
                    }
                });
                parent.append(pos);
                parent.append(size);
            }));
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(file) {
            var opt = this.options;
            var name = _util2.default.basename(file.realpath);
            var outputPath = _util2.default.join(opt.dest, name);
            var outputRealpath = _util2.default.resolve(outputPath);

            if (_util2.default.exists(outputRealpath)) {
                outputPath = _util2.default.join(opt.dest, opt.prefix + name);
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
            var outputPath = _util2.default.resolve(opt.output, opt.prefix + name + '.png');

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
            var opt = this.options;

            opt.src.map(function (f) {
                styles.push.apply(styles, _toConsumableArray(_glob2.default.sync(f)));
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