import proof from 'proof'
import sprite from './sprite'
import lint from './lint'

export default function emilia(opts = {}, content) {
  const options = proof(opts, lint)
  const { resolveUrl, urlDetect, getBuffer, getUrls } = options

  const raw = getUrls(content) // => [{ url, decl }, ...]
  const assignTag = item => ({ ...item, ...urlDetect(item.url) }) // => [{ url, decl, tag, seperator }, ...]
  const assignPath = item => ({ ...item, filepath: resolveUrl(item.url) })
  const assignBuffer = item => ({ ...item, buffer: getBuffer(item.filepath) })
  const maps = raw.map(item => assignBuffer(assignPath(assignTag(item))))

  const { algorithm, padding } = options
  const builder = sprite.bind(null, { algorithm, padding })
}
