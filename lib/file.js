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

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var File = function () {
    function File(_ref) {
        var realpath = _ref.realpath;
        var type = _ref.type;
        (0, _classCallCheck3.default)(this, File);

        this.realpath = realpath;
        this.subpath = realpath.replace(process.cwd() + '/', '');
        this.encoding = type === 'STYLE' ? 'utf8' : 'binary';
        this.content = _io2.default.read(realpath, this.encoding);
        this.stamp = this.content && this.content.length;
        this.type = type;
    }

    (0, _createClass3.default)(File, [{
        key: 'save',
        value: function save() {
            _io2.default.write(this.realpath, this.content, this.encoding);
        }
    }]);
    return File;
}();

var Style = function (_File) {
    (0, _inherits3.default)(Style, _File);

    function Style(realpath) {
        (0, _classCallCheck3.default)(this, Style);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Style).call(this, {
            realpath: realpath,
            type: 'STYLE'
        }));
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
        }
    }, {
        key: 'save',
        value: function save() {
            _io2.default.write(this.realpath, this.content, this.encoding);
        }
    }]);
    return Sprite;
}();

exports.Style = Style;
exports.Image = Image;
exports.Sprite = Sprite;