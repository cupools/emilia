"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  assign: function assign() {
    for (var _len = arguments.length, obj = Array(_len), _key = 0; _key < _len; _key++) {
      obj[_key] = arguments[_key];
    }

    return _assign2.default.apply(Object, [{}].concat(obj));
  },
  map: function map() {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fns[_key2] = arguments[_key2];
    }

    return function (target) {
      return fns.reduceRight(function (ret, fn) {
        return fn(ret);
      }, target);
    };
  },
  maps: function maps() {
    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      fns[_key3] = arguments[_key3];
    }

    return function (target) {
      return fns.reduceRight(function (ret, fn) {
        return ret.map(fn);
      }, target);
    };
  }
};