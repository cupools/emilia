'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _proof = require('proof');

var _proof2 = _interopRequireDefault(_proof);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Emilia = function () {
  function Emilia(plugins) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Emilia);

    this.plugins = plugins;
    this.options = (0, _proof2.default)(opts, _lint2.default);
  }

  (0, _createClass3.default)(Emilia, [{
    key: 'process',
    value: function process(content) {
      var plugins = this.plugins;
      var options = this.options;

      var urlMaps = getUrls(content).map(resolveUrl).map(urlDetect).reduce(function (ret, item) {
        return (0, _lodash2.default)(ret, item);
      }, {});
    }
  }], [{
    key: 'merge',
    value: function merge() {}
  }]);
  return Emilia;
}();

exports.default = Emilia;


function resolveUrl(options, url) {
  var basePath = options.basePath;

  return _path2.default.join(basePath, url);
}

function getUrls(content) {
  var ret = [];

  var root = _postcss2.default.parse(content);
  root.walkDecls(/background(-image)?$/, function (decl) {
    var value = decl.value;

    var start = value.indexOf('url(');
    var end = value.indexOf(')');
    var url = value.substr(start, end);
    ret.push(url);
  });

  return ret;
}

function urlDetect(url) {
  var index = url.indexOf('?__');

  var _url$split = url.split(index);

  var _url$split2 = (0, _slicedToArray3.default)(_url$split, 2);

  var path = _url$split2[0];
  var tag = _url$split2[1];


  return index < 0 ? { unresolve: path } : (0, _defineProperty3.default)({}, tag, path);
}