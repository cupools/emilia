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

var _spritesmith = require('spritesmith');

var _spritesmith2 = _interopRequireDefault(_spritesmith);

var _file = require('./file');

var file = _interopRequireWildcard(_file);

var _sprite = require('./sprite');

var sprite = _interopRequireWildcard(_sprite);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var urlReg = /(?:url\(['"]?([\w\W]+?)(?:\?(__)?([\w\W]+?))?['"]?\))/;

var Task = function () {
    function Task(options) {
        _classCallCheck(this, Task);

        this.options = Object.assign({
            src: ['*.css'],
            dest: './',
            output: './',
            cssPath: '../images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            sizeLimit: 5 * 1024
        }, options);

        this.storage = {};
    }

    _createClass(Task, [{
        key: 'run',
        value: function run() {
            this._initStyle();
            this._scanStyle();
            this._initImage();
            this._buildSprite();
        }
    }, {
        key: '_initStyle',
        value: function _initStyle() {
            var style = this._getResource();

            style.map(this.initStyle);
        }
    }, {
        key: '_initImage',
        value: function _initImage() {
            var _this = this;

            var sprites = this.storage.sprites;
            var keys = Object.keys(sprites);

            keys.map(function (tag) {
                var images = _util2.default.uniq(sprites[tag]);

                images.map(function (p) {
                    _this.initImage(p);
                });
            });
        }
    }, {
        key: 'initStyle',
        value: function initStyle(path) {
            var realPath = _util2.default.resolvePath(path);

            file.wrap({
                path: path,
                realPath: realPath,
                type: 'STYLE',
                content: _fsExtra2.default.readFileSync(realPath, 'utf8')
            });
        }
    }, {
        key: 'initImage',
        value: function initImage(path) {
            var realPath = _util2.default.resolvePath(path);

            file.wrap({
                path: path,
                realPath: realPath,
                type: 'IMAGE',
                content: _fsExtra2.default.readFileSync(realPath, 'binary')
            });
        }
    }, {
        key: '_scanStyle',
        value: function _scanStyle() {
            var _this2 = this;

            var styles = file.getStyles();
            var processor = (0, _postcss2.default)();

            this.storage.sprites = {};

            var keys = Object.keys(styles);
            keys.map(function (p) {
                var file = styles[p];

                processor.use(_this2._walkDecls.bind(_this2, file));
                processor.process(file.content).catch();
            });
        }
    }, {
        key: '_walkDecls',
        value: function _walkDecls(file, css) {
            var opt = this.options;
            var sprites = this.storage.sprites;

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

                        var realPath = _util2.default.joinPath(file.path, '../', url);
                        var p = _util2.default.relativePath(process.cwd(), realPath);

                        sprites[tag].push(p);

                        decl.value = val.replace(urlReg, 'url(' + opt.cssPath + tag + '.png)');
                    }
                }
            });
        }
    }, {
        key: '_buildSprite',
        value: function _buildSprite() {
            var sprites = this.storage.sprites;
            var keys = Object.keys(sprites);
            var opt = this.options;
            // console.log(sprites);

            keys.map(function (tag) {
                var sp = sprites[tag].map(function (f) {
                    return _util2.default.resolvePath(f);
                });
                var ret = sprite.processSprite({
                    sprites: sp,
                    options: opt
                });
            });
        }
    }, {
        key: 'outputStyle',
        value: function outputStyle(file) {}
    }, {
        key: 'outputImage',
        value: function outputImage(file) {}
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