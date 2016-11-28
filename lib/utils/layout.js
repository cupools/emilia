'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _layout = require('layout');

var _layout2 = _interopRequireDefault(_layout);

var _lodash = require('lodash.sortby');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TopDown = {
  sort: function sort(items) {
    return (0, _lodash2.default)(items, function (item) {
      return item.height;
    });
  },
  placeItems: function placeItems(items) {
    var y = 0;

    return items.map(function (item) {
      var ret = (0, _extends3.default)({}, item, { x: 0, y: y });
      y += item.height;
      return ret;
    });
  }
};

var LeftRight = {
  sort: function sort(items) {
    return (0, _lodash2.default)(items, function (item) {
      return item.width;
    });
  },
  placeItems: function placeItems(items) {
    var x = 0;

    return items.map(function (item) {
      var ret = (0, _extends3.default)({}, item, { x: x, y: 0 });
      x += item.width;
      return ret;
    });
  }
};

_layout2.default.addAlgorithm('top-down', TopDown);
_layout2.default.addAlgorithm('left-right', LeftRight);

exports.default = _layout2.default;