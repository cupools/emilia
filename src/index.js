import proof from 'proof'
import sprite from './sprite'
import lint from './lint'

export default function emilia(opts = {}, content) {
  const options = proof(opts, lint)
  const { resolveUrl, detectUrl, getBuffer, getUrls, getGroup } = options

  const raw = getUrls(content) // => [{ url, decl }, ...]
  const assignTag = item => ({ ...item, ...detectUrl(item.url) })
  const assignPath = item => ({ ...item, filepath: resolveUrl(item.url) })
  const assignBuffer = item => ({ ...item, buffer: getBuffer(item.filepath) })
  const assignGroup = item => ({ ...item, group: getGroup(item.tag) })
  const bundles = raw.map(map(assignBuffer, assignPath, assignTag))

  const { algorithm, padding } = options
  const builder = sprite.bind(null, { algorithm, padding })
}

function map(...fns) {
  return target => fns.reduceRight((ret, fn) => fn(ret), target)
}
