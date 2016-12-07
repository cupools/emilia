/* eslint-disable new-cap */
import Images from 'images'
import layout from './utils/layout'
import cache from './utils/cache'

const INFINITE = 10e9
Images.setLimit(INFINITE, INFINITE)

/**
 * build sprite images
 * @param  {Object} options padding & algorithm
 * @param  {Array} buffers   buffer of images
 * @return {Object}         coordinates & size
 */
export default function process(options, buffers) {
  const fromCache = cache.get(options, buffers)
  if (fromCache) {
    return fromCache
  }

  const { padding, algorithm } = options
  const layer = layout(algorithm)

  const base64 = buffers.map(buffer => buffer.toString('base64'))
  buffers.forEach((buffer, index) => {
    const parent = base64.slice(0, index).indexOf(base64[index])
    const image = Images(buffer)
    const size = image.size()

    layer.addItem({
      parent,
      index,
      image,
      width: parent === -1 ? size.width + padding : 0,
      height: parent === -1 ? size.height + padding : 0
    })
  })


  const result = layer.export()

  const width = result.width - padding
  const height = result.height - padding
  const coordinates = result.items.map(item => {
    const { parent } = item
    const real = parent === -1 ? item : result.items[parent]
    const { x, y } = real

    return {
      x,
      y,
      width: real.width - padding,
      height: real.height - padding
    }
  })

  const sprite = Images(width, height)
  result.items.forEach(({ image, parent, x, y }) => parent === -1 && sprite.draw(image, x, y))

  return cache.set(options, buffers, {
    buffer: sprite.encode('png'),
    width,
    height,
    coordinates
  })
}
