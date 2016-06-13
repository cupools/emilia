'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (options) {
    return new Emilia(options);
};

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _file = require('./file');

var File = _interopRequireWildcard(_file);

var _sprite2 = require('./sprite');

var sprite = _interopRequireWildcard(_sprite2);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var urlReg = /(?:url\(['"]?([\w\W]+?)(?:\?(__)?([\w\W]+?))?['"]?\))/;
var declFilter = /(-webkit-)?background-(size|repeat)/;

var Emilia = function () {
    function Emilia(options) {
        _classCallCheck(this, Emilia);

        this.options = Object.assign({
            src: ['*.css'],
            dest: './',
            output: './components/images/',
            cssPath: '../components/images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            sizeLimit: 5 * 1024,
            unit: 'px',
            convert: 1
        }, options);

        this.File = File;
    }

    _createClass(Emilia, [{
        key: 'run',
        value: function run() {
            this._initStyle();
            this._initImage();
            this._buildSprite();
            this._outputImage();
            this._outputStyle();
        }
    }, {
        key: '_initStyle',
        value: function _initStyle() {
            var _this = this;

            this._getResource().map(function (p) {
                var f = _this.initStyle(p);
                _this._scanStyle(f);
            });
        }
    }, {
        key: 'initStyle',
        value: function initStyle(realpath) {
            return File.wrap({
                realpath: realpath,
                type: 'STYLE',
                content: _fsExtra2.default.readFileSync(realpath, 'utf8')
            });
        }
    }, {
        key: '_scanStyle',
        value: function _scanStyle(file) {
            var processor = (0, _postcss2.default)();
            processor.use(this._walkDecls.bind(this, file));
            processor.process(file.content).catch();
        }
    }, {
        key: '_walkDecls',
        value: function _walkDecls(file, css) {
            var _this2 = this;

            css.walkDecls(function (decl) {
                if (decl.prop.indexOf('background') !== -1) {
                    var group = urlReg.exec(decl.value);

                    if (group && group[2]) {
                        var url = group[1];
                        var tag = group[3];

                        var realpath = _this2._getImageRealpath(url, file.realpath);
                        sprite.add(realpath, tag);
                    }
                }
            });
        }
    }, {
        key: '_initImage',
        value: function _initImage() {
            var _this3 = this;

            var map = sprite.get();
            _util2.default.forIn(map, function (val) {
                return _util2.default.uniq(val).map(_this3.initImage);
            });
        }
    }, {
        key: 'initImage',
        value: function initImage(realpath) {
            return File.wrap({
                realpath: realpath,
                type: 'IMAGE',
                content: _fsExtra2.default.readFileSync(realpath, 'binary')
            });
        }
    }, {
        key: '_buildSprite',
        value: function _buildSprite() {
            var opt = this.options;

            sprite.build(opt, function (sp) {
                var path = _util2.default.joinPath(opt.output, opt.prefix + sp.tag + '.png');
                var content = new Buffer(sp.image);

                File.wrap({
                    path: path,
                    content: content,
                    id: sp.tag,
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
        key: '_outputImage',
        value: function _outputImage() {
            var _this4 = this;

            var sprites = File.getSprites();
            _util2.default.forIn(sprites, function (file) {
                return _this4.outputImage(file);
            });
        }
    }, {
        key: '_outputStyle',
        value: function _outputStyle() {
            var _this5 = this;

            var processor = (0, _postcss2.default)();
            var styles = File.getStyles();

            _util2.default.forIn(styles, function (file) {
                processor.use(_this5._updateDecls.bind(_this5, file));
                file.content = processor.process(file.content).css;

                _this5.outputStyle(file);
            });
        }
    }, {
        key: '_updateDecls',
        value: function _updateDecls(file, css) {
            var _this6 = this;

            var opt = this.options;

            css.walkDecls(function (decl) {
                if (decl.prop.indexOf('background') !== -1) {
                    var val = decl.value;
                    var group = urlReg.exec(val);

                    if (group && group[2]) {
                        var url = group[1];
                        var tag = group[3];

                        var realpath = _this6._getImageRealpath(url, file.realpath);
                        var _sprite = File.getFile(tag);
                        var meta = _sprite.meta;
                        var chip = meta.coordinates[realpath];

                        var pos = _postcss2.default.decl({
                            prop: 'background-position',
                            value: '' + -chip.x / opt.convert + opt.unit + ' ' + -chip.y / opt.convert + opt.unit
                        });
                        var size = _postcss2.default.decl({
                            prop: 'background-size',
                            value: '' + meta.width / opt.convert + opt.unit + ' ' + meta.height / opt.convert + opt.unit
                        });

                        url = _sprite.url || '' + opt.cssPath + opt.prefix + tag + '.png';
                        decl.value = val.replace(urlReg, 'url(' + url + ')');

                        var parent = decl.parent;

                        parent.walkDecls(function (decl) {
                            if (declFilter.test(decl.prop)) {
                                decl.remove();
                            }
                        });
                        parent.append(pos);
                        parent.append(size);
                    }
                }
            });
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(file) {
            var opt = this.options;
            var name = _util2.default.basename(file.realpath);
            var outputPath = _util2.default.resolvePath(opt.dest + name);

            _fsExtra2.default.outputFileSync(outputPath, file.content, 'utf8');
        }
    }, {
        key: 'outputImage',
        value: function outputImage(file) {
            var opt = this.options;
            var name = file.id;
            var outputPath = _util2.default.resolvePath(opt.output, opt.prefix + name + '.png');

            _fsExtra2.default.outputFileSync(outputPath, file.content, 'binary');
        }
    }, {
        key: '_getImageRealpath',
        value: function _getImageRealpath(url, stylePath) {
            return _util2.default.joinPath(stylePath, '../', url);
        }
    }, {
        key: '_getResource',
        value: function _getResource() {
            var styles = [];
            var opt = this.options;

            opt.src.map(function (f) {
                styles.push.apply(styles, _toConsumableArray(_glob2.default.sync(f).map(function (p) {
                    return _util2.default.resolvePath(p);
                })));
            });

            return styles;
        }
    }]);

    return Emilia;
}();