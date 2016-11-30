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

  files.forEach(file => {
    const img = Images(file.content)
    const size = img.size()
    const meta = { file, img }

    const item = {
      ...meta,
      width: size.width + padding,
      height: size.height + padding
    }

    layer.addItem(item)
  })


  const { items } = layer.export()
  const width = layer.width - padding
  const height = layer.height - padding
  const sprite = Images(width, height)

  const properties = { width, height }
  let coordinates = {}

  items.forEach(item => {
    const { file, img, x, y } = item

    coordinates[file.realpath] = {
      x,
      y,
      width: item.width - padding,
      height: item.height - padding
    }

    sprite.draw(img, x, y)
  })

  console.log(coordinates, properties)

  return {
    image: sprite.encode('png'),
    coordinates,
    properties
  }
}
