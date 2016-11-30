'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = emilia;

var _proof = require('proof');

var _proof2 = _interopRequireDefault(_proof);

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


  var maps = getUrls(content) // => [url, ...]
  .map(urlDetect) // => [{ url, tag, seperator }, ...]
  .reduce( // => { [tag]: [{ url, tag, seperator }] }
  function (ret, _ref) {
    var url = _ref.url;
    var tag = _ref.tag;
    var seperator = _ref.seperator;
    return (0, _defineProperty3.default)({}, tag, (ret[tag] || []).concat({ url: url, tag: tag, seperator: seperator }));
  }, {});

  var mapsWithPath = eachAssign(maps, function (item) {
    return (0, _extends4.default)({}, item, { filepath: resolveUrl(item.url) });
  });
  var mapsWithBuffer = eachAssign(mapsWithPath, function (item) {
    return (0, _extends4.default)({}, item, { buffer: getBuffer(item.filepath) });
  });
}

function eachAssign(obj, fn) {
  return (0, _keys2.default)(obj).reduce(function (ret, key) {
    return (0, _extends4.default)({}, ret, (0, _defineProperty3.default)({}, key, obj[key].map(fn)));
  }, {});
}