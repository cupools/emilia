"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  map: function map() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }

    return function (target) {
      return fns.reduceRight(function (ret, fn) {
        return fn(ret);
      }, target);
    };
  },
  Map: function Map() {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fns[_key2] = arguments[_key2];
    }

    return function (target) {
      return fns.reduceRight(function (ret, fn) {
        return ret.map(fn);
      }, target);
    };
  }
};