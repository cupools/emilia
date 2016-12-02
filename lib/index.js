'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _includes = require('babel-runtime/core-js/array/includes');

var _includes2 = _interopRequireDefault(_includes);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = emilia;

var _proof = require('proof');

var _proof2 = _interopRequireDefault(_proof);

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emilia() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var content = arguments[1];

  var options = (0, _proof2.default)(opts, _lint2.default);
  var resolveUrl = options.resolveUrl;
  var urlDetect = options.urlDetect;
  var getBuffer = options.getBuffer;
  var getUrls = options.getUrls;


  var raw = getUrls(content); // => [{ url, decl }, ...]
  var assignTag = function assignTag(item) {
    return (0, _extends3.default)({}, item, urlDetect(item.url));
  }; // => [{ url, decl, tag, seperator }, ...]
  var assignPath = function assignPath(item) {
    return (0, _extends3.default)({}, item, { filepath: resolveUrl(item.url) });
  };
  var assignBuffer = function assignBuffer(item) {
    return (0, _extends3.default)({}, item, { buffer: getBuffer(item.filepath) });
  };
  var bundles = raw.map(map(assignBuffer, assignPath, assignTag));

  var algorithm = options.algorithm;
  var padding = options.padding;

  var builder = _sprite2.default.bind(null, { algorithm: algorithm, padding: padding });
  var tags = bundles.reduce(function (ret, _ref) {
    var tag = _ref.tag;
    return (0, _includes2.default)(ret, tag) ? ret : ret.concat(tag);
  }, []);

  var outputs = tags.map(function (tag) {
    return builder(bundles.filter(function (item) {
      return item.tag === tag;
    }).map(function (item) {
      return item.buffer;
    }));
  });
}

function map() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (target) {
    return fns.reduceRight(function (ret, fn) {
      return fn(ret);
    }, target);
  };
}