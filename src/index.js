import proof from 'proof'
import sprite from './sprite'
import lint from './lint'
import _ from './util'

export default function emilia(opts = {}, content) {
  const options = proof(opts, lint)
  const { resolveUrl, detectUrl, getBuffer, getUrls } = options
  const { algorithm, padding } = options
  const processor = sprite.bind(null, { algorithm, padding })

  const { root, urls } = getUrls(content)

  const assignTag = item => ({ ...item, ...detectUrl(item.url) })
  const assignLocate = item => ({ ...item, locate: resolveUrl(item.url) })
  const assignBuffer = item => ({ ...item, buffer: getBuffer(item.locate) })
  const prune = item => item.tag && item.locate && item.buffer

  const bundles = urls.map(_.map(assignBuffer, assignLocate, assignTag)).filter(prune)

  const { getID, getGroup, getSprite, getContent } = options
  const assignID = item => ({ ...item, id: getID(bundles, item) })
  const assignGroup = item => ({ ...item, group: getGroup(bundles, item.tag) })
  const assignSprite = item => (
    { ...item, sprite: getSprite(processor, bundles, item.group) }
  )

  const { publicPath } = options
  const result = _.maps(assignSprite, assignGroup, assignID)(bundles)
  const ret = getContent({ publicPath }, root, result)

  return {
    content: ret,
    items: result
  }
}
