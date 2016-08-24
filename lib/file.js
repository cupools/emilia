'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sprite = exports.Image = exports.Style = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var File = function () {
    function File(_ref) {
        var realpath = _ref.realpath;
        var type = _ref.type;
        (0, _classCallCheck3.default)(this, File);

        this.realpath = realpath;
        this.subpath = realpath.replace(process.cwd() + '/', '');
        this.basename = _path2.default.basename(realpath);
        this.encoding = type === 'STYLE' ? 'utf8' : 'binary';
        this.content = _io2.default.read(realpath, this.encoding);
        this.stamp = this.content && this.content.length;
        this.type = type;
    }

    (0, _createClass3.default)(File, [{
        key: 'save',
        value: function save() {
            _io2.default.write(this.output, this.content, this.encoding);
            _log2.default.build(this.output.replace(process.cwd() + '/', ''));
        }
    }]);
    return File;
}();

var Style = function (_File) {
    (0, _inherits3.default)(Style, _File);

    function Style(realpath, _ref2) {
        var dest = _ref2.dest;
        (0, _classCallCheck3.default)(this, Style);

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Style).call(this, {
            realpath: realpath,
            type: 'STYLE'
        }));

        _this.output = _path2.default.resolve(dest, _this.basename);
        return _this;
    }

    return Style;
}(File);

var Image = function (_File2) {
    (0, _inherits3.default)(Image, _File2);

    function Image(realpath, url) {
        (0, _classCallCheck3.default)(this, Image);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Image).call(this, {
            realpath: realpath,
            type: 'IMAGE'
        }));

        _this2.url = url;
        return _this2;
    }

    (0, _createClass3.default)(Image, [{
        key: 'base64',
        value: function base64() {
            var extname = _path2.default.extname(this.realpath).slice(1);
            return 'data:image/' + extname + ';base64,' + this.content.toString('base64');
        }
    }]);
    return Image;
}(File);

var Sprite = function () {
    function Sprite(realpath, tag, dependences, options) {
        (0, _classCallCheck3.default)(this, Sprite);

        this.realpath = realpath;
        this.subpath = realpath.replace(process.cwd() + '/', '');
        this.encoding = 'binary';
        this.type = 'SPRITE';

        this.tag = tag;
        this.dependences = dependences;
        this.url = options.cssPath + _path2.default.basename(realpath);
        this.options = options;
        this.stamp = dependences.reduce(function (ret, file) {
            return ret += file.stamp;
        }, '');
        this.properties = null;
        this.coordinates = null;
        this.content = null;
    }

    (0, _createClass3.default)(Sprite, [{
        key: 'build',
        value: function build() {
            var ret = _image2.default.process(this.dependences, this.options);

            this.coordinates = ret.coordinates;
            this.properties = ret.properties;
            this.content = ret.image;

            return this;
        }
    }, {
        key: 'save',
        value: function save() {
            _io2.default.write(this.realpath, this.content, this.encoding);
            _log2.default.build(this.subpath);
        }
    }]);
    return Sprite;
}();

exports.Style = Style;
exports.Image = Image;
exports.Sprite = Sprite;