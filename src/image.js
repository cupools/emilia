import Images from 'images'
import layout from './utils/layout'

const INFINITE = 10e9

export default {
    /**
     * build sprite images
     * @param  {Array} files   buffer of images
     * @param  {Object} options padding & algorithm
     * @return {Object}         coordinates & size
     */
    process(files, options) {
        let {padding, algorithm} = options
        let layer = layout(algorithm)

        files.forEach(file => {
            let img = Images(file.content)
            let size = img.size()
            let meta = {
                file,
                img
            }

            let item = Object.assign({}, meta, {
                width: size.width + padding,
                height: size.height + padding
            })

            layer.addItem(item)
        })

        let {width, height, items} = layer.export()

        width -= padding
        height -= padding

        Images.setLimit(INFINITE, INFINITE)
        let sprite = Images(width, height)

        let coordinates = {}
        let properties = {
            width,
            height
        }

        items.forEach(item => {
            let {file, img, x, y, width, height} = item

            width -= padding
            height -= padding

            coordinates[file.realpath] = {
                width,
                height,
                x,
                y
            }
            sprite.draw(img, x, y)
        })

        return {
            image: sprite.encode('png'),
            coordinates,
            properties
        }
    }
}
