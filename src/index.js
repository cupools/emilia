import proof from 'proof'
import lint from './lint'

export default function emilia(opts = {}, content) {
  const options = proof(opts, lint)
  const { resolveUrl, urlDetect, getBuffer, getUrls } = options

  const maps = getUrls(content) // => [url, ...]
    .map(urlDetect) // => [{ url, tag, seperator }, ...]
    .reduce( // => { [tag]: [{ url, tag, seperator }] }
      (ret, { url, tag, seperator }) => ({
        [tag]: (ret[tag] || []).concat({ url, tag, seperator })
      }),
      {}
    )

  const mapsWithPath = eachAssign(maps, item => ({ ...item, filepath: resolveUrl(item.url) }))
  const mapsWithBuffer = eachAssign(
    mapsWithPath,
    item => ({ ...item, buffer: getBuffer(item.filepath) })
  )
}

function eachAssign(obj, fn) {
  return Object.keys(obj).reduce(
    (ret, key) => ({
      ...ret,
      [key]: obj[key].map(fn)
    }),
    {}
  )
}
