'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  resolveUrl: {
    typeOf: 'function'
  },
  publicPath: {
    typeOf: 'string',
    def: '/'
  },
  algorithm: {
    oneOf: ['binary-tree', 'top-down', 'left-right', 'diagonal', 'alt-diagonal'],
    def: 'binary-tree'
  },
  padding: {
    typeOf: 'number',
    def: 0
  }
};