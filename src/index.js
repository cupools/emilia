import proof from 'proof'
import sprite from './sprite'
import lint from './lint'
import _ from './utils/util'

export default function emilia(opts, content) {
  const options = proof(opts, lint)
  const { resolveUrl, detectUrl, getBuffer, getUrls } = options

  const { root, urls } = getUrls(content)

  const assignTag = item => _.assign(item, detectUrl(item.url))
  const assignLocate = item => _.assign(item, { locate: resolveUrl(item.url) })
  const assignBuffer = item => _.assign(item, { buffer: getBuffer(item.locate) })
  const prune = item => item.tag && item.locate && item.buffer

  const bundles = urls.map(_.map(assignBuffer, assignLocate, assignTag)).filter(prune)

  const { getID, getGroup, getSprite, getContent } = options
  const { algorithm, padding } = options
  const processor = sprite.bind(null, { algorithm, padding })

  const assignID = item => _.assign(item, { id: getID(bundles, item) })
  const assignGroup = item => _.assign(item, { group: getGroup(bundles, item.tag) })
  const assignSprite = item => _.assign(item, { sprite: getSprite(processor, bundles, item.group) })

  const { publicPath } = options
  const result = _.maps(assignSprite, assignGroup, assignID)(bundles)
  const ret = getContent({ publicPath }, root, result)

  return {
    content: ret,
    items: result
  }
}
