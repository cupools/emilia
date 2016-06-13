'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (options) {
    return new Task(options);
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

var Task = function () {
    function Task(options) {
        _classCallCheck(this, Task);

        this.options = Object.assign({
            src: ['*.css'],
            dest: './',
            output: './components/images/',
            cssPath: '../../components/images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            sizeLimit: 5 * 1024
        }, options);

        this.storage = {
            spritesMap: {}
        };

        this.File = File;
    }

    _createClass(Task, [{
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

            var sprites = this.storage.spritesMap;

            css.walkDecls(function (decl) {
                if (decl.prop.indexOf('background') !== -1 && decl.value.indexOf('?__') !== -1) {
                    var val = decl.value;
                    var group = urlReg.exec(val);

                    if (group && group[2]) {
                        var url = group[1];
                        var tag = group[3];

                        if (!sprites[tag]) {
                            sprites[tag] = [];
                        }

                        var realpath = _this2._getImageRealpath(url, file.realpath);
                        sprites[tag].push(realpath);
                    }
                }
            });
        }
    }, {
        key: '_initImage',
        value: function _initImage() {
            var _this3 = this;

            var spritesMap = this.storage.spritesMap;
            var keys = Object.keys(spritesMap);

            keys.map(function (tag) {
                var images = _util2.default.uniq(spritesMap[tag]);

                images.map(function (realpath) {
                    _this3.initImage(realpath);
                });
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
            var spritesMap = this.storage.spritesMap;
            var keys = Object.keys(spritesMap);
            var opt = this.options;

            keys.map(function (tag) {
                var ret = sprite.processSprite({
                    tag: tag,
                    sprites: spritesMap[tag],
                    options: opt
                });

                var path = _util2.default.joinPath(opt.output, tag + '.png');
                var content = new Buffer(ret.image);

                File.wrap({
                    path: path,
                    content: content,
                    id: tag,
                    type: 'SPRITE',
                    meta: {
                        width: ret.properties.width,
                        height: ret.properties.height,
                        coordinates: ret.coordinates
                    }
                });
            });
        }
    }, {
        key: '_outputStyle',
        value: function _outputStyle() {
            var _this4 = this;

            var processor = (0, _postcss2.default)();
            var styles = File.getStyles();
            var keys = Object.keys(styles);

            keys.map(function (p) {
                var file = styles[p];
                processor.use(_this4._updateDecls.bind(_this4, file));

                var css = processor.process(file.content).css;
                file.content = css;

                _this4.outputStyle(file);
            });
        }
    }, {
        key: '_updateDecls',
        value: function _updateDecls(file, css) {
            var _this5 = this;

            var opt = this.options;

            css.walkDecls(function (decl) {
                if (decl.prop.indexOf('background') !== -1 && decl.value.indexOf('?__') !== -1) {
                    var val = decl.value;
                    var group = urlReg.exec(val);

                    if (group && group[2]) {
                        var url = group[1];
                        var tag = group[3];

                        var realpath = _this5._getImageRealpath(url, file.realpath);
                        var _sprite = File.getFile(tag);
                        var meta = _sprite.meta;
                        var chip = meta.coordinates[realpath];

                        var pos = _postcss2.default.decl({
                            prop: 'background-position',
                            value: -chip.x + 'px ' + -chip.y + 'px'
                        });
                        var size = _postcss2.default.decl({
                            prop: 'background-size',
                            value: meta.width + 'px ' + meta.height + 'px'
                        });

                        url = _sprite.url || '' + opt.cssPath + tag + '.png';
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
        key: '_outputImage',
        value: function _outputImage() {
            var _this6 = this;

            var sprites = File.getSprites();
            var keys = Object.keys(sprites);

            keys.map(function (tag) {
                _this6.outputImage(sprites[tag]);
            });
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(file) {
            console.log(file.content);
        }
    }, {
        key: 'outputImage',
        value: function outputImage(file) {}

        /**
         * Get Image realpath in stylesheet by url
         * It can be rewrite in need
         */

    }, {
        key: '_getImageRealpath',
        value: function _getImageRealpath(url, stylePath) {
            return _util2.default.joinPath(stylePath, '../', url);
        }

        /**
         * get stylesheet realpath by node-glob
         */

    }, {
        key: '_getResource',
        value: function _getResource() {
            var style = [];
            var opt = this.options;

            opt.src.map(function (f) {
                style.push.apply(style, _toConsumableArray(_glob2.default.sync(f).map(function (p) {
                    return _util2.default.resolvePath(p);
                })));
            });

            return style;
        }
    }]);

    return Task;
}();