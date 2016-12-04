import proof from 'proof'
import _ from './util'
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
  const bundles = raw.map(_.map(assignBuffer, assignPath, assignTag))

  const assignGroup = item => ({ ...item, group: getGroup.bind(null, bundles)(item.tag) })
  const assignSprite = item => (
    { ...item, sprite: getSprite.bind(null, processor, bundles)(item.group) }
  )

  const result = _.Map(assignSprite, assignGroup)(bundles)
}
