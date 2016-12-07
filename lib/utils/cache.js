'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

function get(options, buffers) {
  var key = sign(options, buffers);
  return cache[key];
}

function set(options, buffers, result) {
  var key = sign(options, buffers);
  cache[key] = result;
  return result;
}

function sign(options, buffers) {
  var hash = _crypto2.default.createHash('sha1');
  var content = Array.isArray(buffers) ? buffers.reduce(function (ret, buffer) {
    return ret + buffer.toString('base64');
  }, (0, _stringify2.default)(options)) : (0, _stringify2.default)(options) + buffers;

  hash.update(content);
  return hash.digest('hex');
}

exports.default = { get: get, set: set, sign: sign };