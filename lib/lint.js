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
    default: methods.resolveUrl,
    coerce: methods.wrap
  },
  detectUrl: {
    typeOf: 'function',
    default: methods.detectUrl,
    coerce: methods.wrap
  },
  getUrls: {
    typeOf: 'function',
    default: methods.getUrls,
    coerce: methods.wrap
  },
  getBuffer: {
    typeOf: 'function',
    default: methods.getBuffer,
    coerce: methods.wrap
  },
  getID: {
    typeOf: 'function',
    default: methods.getID,
    coerce: methods.wrap
  },
  getGroup: {
    typeOf: 'function',
    default: methods.getGroup,
    coerce: methods.wrap
  },
  getSprite: {
    typeOf: 'function',
    default: methods.getSprite,
    coerce: methods.wrap
  },
  getContent: {
    typeOf: 'function',
    default: methods.getContent
  },
  publicPath: {
    typeOf: 'string',
    default: ''
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