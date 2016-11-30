'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.resolveUrl = resolveUrl;
exports.getBuffer = getBuffer;
exports.getUrls = getUrls;
exports.urlDetect = urlDetect;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveUrl(url) {
  return url;
}

function getBuffer(url) {
  return _fs2.default.readFileSync(url);
}

function getUrls(content) {
  var ret = [];

  var root = _postcss2.default.parse(content);
  root.walkDecls(/background(-image)?$/, function (decl) {
    var value = decl.value;

    var start = value.indexOf('url(');
    var end = value.indexOf(')');
    var url = value.substring(start + 4, end - 1).replace(/^[\s"']|[\s"']$/, '');
    ret.push(url);
  });

  return ret;
}

function urlDetect(raw) {
  var seperator = '?__';

  var _raw$split = raw.split(seperator);

  var _raw$split2 = (0, _slicedToArray3.default)(_raw$split, 2);

  var url = _raw$split2[0];
  var tag = _raw$split2[1];

  return tag ? { url: url, tag: tag, seperator: seperator, raw: raw } : null;
}