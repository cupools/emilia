import proof from 'proof'
import sprite from './sprite'
import lint from './lint'

export default function emilia(opts = {}, content) {
  const options = proof(opts, lint)
  const { resolveUrl, detectUrl, getBuffer, getUrls, getGroup, getSprite } = options
  const { algorithm, padding } = options
  const processor = sprite.bind(null, { algorithm, padding })

  const raw = getUrls(content) // => [{ url, decl }, ...]
  const assignTag = item => ({ ...item, ...detectUrl(item.url) })
  const assignPath = item => ({ ...item, filepath: resolveUrl(item.url) })
  const assignBuffer = item => ({ ...item, buffer: getBuffer(item.filepath) })
  const bundles = raw.map(map(assignBuffer, assignPath, assignTag))

  const assignGroup = items => items.map(
    item => ({ ...item, group: getGroup.bind(null, items)(item.tag) })
  )
  const assignSprite = items => items.map(
    item => ({ ...item, sprite: getSprite.bind(null, processor, items)(item.group) })
  )

  const result = map(assignSprite, assignGroup)(bundles)
}

function map(...fns) {
  return target => fns.reduceRight((ret, fn) => fn(ret), target)
}
