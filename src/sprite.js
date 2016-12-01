/* eslint-disable new-cap */
import Images from 'images'
import layout from './utils/layout'

const INFINITE = 10e9
Images.setLimit(INFINITE, INFINITE)

/**
 * build sprite images
 * @param  {Object} options padding & algorithm
 * @param  {Array} files   buffer of images
 * @return {Object}         coordinates & size
 */
export default function process(options, files) {
  const { padding, algorithm } = options
  const layer = layout(algorithm)

  files.forEach((file, index) => {
    const image = Images(file)
    const size = image.size()

    const item = {
      index,
      image,
      width: size.width + padding,
      height: size.height + padding
    }

    layer.addItem(item)
  })


  const result = layer.export()
  const width = result.width - padding
  const height = result.height - padding
  const properties = { width, height }
  const coordinates = result.items.map(item => {
    const { x, y } = item
    return {
      x,
      y,
      width: item.width - padding,
      height: item.height - padding
    }
  })

  const sprite = Images(width, height)
  result.items.forEach(({ image, x, y }) => sprite.draw(image, x, y))

  return {
    image: sprite.encode('png'),
    coordinates,
    properties
  }
}
