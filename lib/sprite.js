'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processSprite = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = {};

function processSprite(_ref) {
    var tag = _ref.tag;
    var sprites = _ref.sprites;
    var options = _ref.options;

    var ret = _child_process2.default.execFileSync(_path2.default.join(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)]);
    var result = JSON.parse(ret.toString());
    storage[tag] = result;
    return result;
}

exports.processSprite = processSprite;