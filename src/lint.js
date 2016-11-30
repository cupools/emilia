import * as methods from './methods'

export default {
  resolveUrl: {
    typeOf: 'function',
    default: methods.resolveUrl
  },
  getBuffer: {
    typeOf: 'function',
    default: methods.getBuffer
  },
  getUrls: {
    typeOf: 'function',
    default: methods.getUrls
  },
  urlDetect: {
    typeOf: 'function',
    default: methods.urlDetect
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
