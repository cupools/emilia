import path from 'path'
import merge from 'lodash.merge'
import postcss from 'postcss'
import proof from 'proof'
import lint from './lint'

export default class Emilia {
  constructor(plugins, opts = {}) {
    this.plugins = plugins
    this.options = proof(opts, lint)
  }

  process(content) {
    const { plugins, options } = this
    const urlMaps = getUrls(content)
      .map(resolveUrl)
      .map(urlDetect)
      .reduce((ret, item) => merge(ret, item), {})
  }

  static merge(...args) {}
}

function resolveUrl(options, url) {
  const { basePath } = options
  return path.join(basePath, url)
}

function getUrls(content) {
  let ret = []

  const root = postcss.parse(content)
  root.walkDecls(/background(-image)?$/, decl => {
    const { value } = decl
    const start = value.indexOf('url(')
    const end = value.indexOf(')')
    const url = value.substr(start, end)
    ret.push(url)
  })

  return ret
}

function urlDetect(url) {
  const index = url.indexOf('?__')
  const [path, tag] = url.split(index)

  return index < 0
    ? { unresolve: path }
    : { [tag]: path }
}
