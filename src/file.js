import path from 'path'

import io from './io'
import image from './image'
import log from './utils/log'

class File {
    constructor({realpath, type}) {
        this.realpath = realpath
        this.subpath = realpath.replace(process.cwd() + '/', '')
        this.basename = path.basename(realpath)
        this.encoding = type === 'STYLE' ? 'utf8' : 'binary'
        this.content = io.read(realpath, this.encoding)
        this.stamp = this.content && this.content.length
        this.type = type
    }

    save() {
        io.write(this.output, this.content, this.encoding)
        log.build(this.output.replace(process.cwd() + '/', ''))
    }
}

class Style extends File {
    constructor(realpath, {dest}) {
        super({
            realpath,
            type: 'STYLE'
        })

        this.output = path.resolve(dest, this.basename)
    }
}

class Image extends File {
    constructor(realpath, url) {
        super({
            realpath,
            type: 'IMAGE'
        })

        this.url = url
    }

    base64() {
        let extname = path.extname(this.realpath).slice(1)
        return `data:image/${extname};base64,` + this.content.toString('base64')
    }
}

class Sprite {
    constructor(realpath, tag, dependences, options) {
        this.realpath = realpath
        this.subpath = realpath.replace(process.cwd() + '/', '')
        this.encoding = 'binary'
        this.type = 'SPRITE'

        this.tag = tag
        this.dependences = dependences
        this.url = options.cssPath + path.basename(realpath)
        this.options = options
        this.stamp = dependences.reduce((ret, file) => (ret += file.stamp), '')
        this.properties = null
        this.coordinates = null
        this.content = null
    }

    build() {
        let ret = image.process(this.dependences, this.options)

        this.coordinates = ret.coordinates
        this.properties = ret.properties
        this.content = ret.image

        return this
    }

    save() {
        io.write(this.realpath, this.content, this.encoding)
        log.build(this.subpath)
    }
}

export {Style, Image, Sprite}
