'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _methods = require('./methods');

var methods = _interopRequireWildcard(_methods);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  resolveUrl: {
    typeOf: 'function',
    default: methods.resolveUrl
  },
  detectUrl: {
    typeOf: 'function',
    default: methods.detectUrl
  },
  getUrls: {
    typeOf: 'function',
    default: methods.getUrls
  },
  getBuffer: {
    typeOf: 'function',
    default: methods.getBuffer
  },
  getGroup: {
    typeOf: 'function',
    default: methods.getGroup
  },
  publicPath: {
    typeOf: 'string',
    default: '/'
  },
  algorithm: {
    oneOf: ['binary-tree', 'top-down', 'left-right', 'diagonal', 'alt-diagonal'],
    default: 'binary-tree'
  },
  padding: {
    typeOf: 'number',
    default: 0
  }
};