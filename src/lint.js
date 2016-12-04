import * as methods from './methods'

export default {
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
  getSprite: {
    typeOf: 'function',
    default: methods.getSprite
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
}
