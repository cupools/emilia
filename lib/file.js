'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSprites = exports.getImages = exports.getStyles = exports.wrap = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var asserts = {
    style: {},
    image: {},
    sprite: {}
};

var File = function File(_ref) {
    var id = _ref.id;
    var path = _ref.path;
    var content = _ref.content;
    var type = _ref.type;
    var realPath = _ref.realPath;

    _classCallCheck(this, File);

    id = path;
    Object.assign(this, { id: id, path: path, type: type, content: content, realPath: realPath });
};

function wrap(params) {
    var f = new File(params);
    var type = f.type.toLowerCase();
    var id = f.id;

    asserts[type][id] = f;

    return f;
}

function getStyles() {
    return asserts.style;
}

function getImages() {
    return asserts.image;
}

function getSprites() {
    return asserts.sprite;
}

exports.wrap = wrap;
exports.getStyles = getStyles;
exports.getImages = getImages;
exports.getSprites = getSprites;