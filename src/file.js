import io from './io'

class File {
    constructor({realpath, type}) {
        this.realpath = realpath
        this.subpath = realpath.replace(process.cwd() + '/', '')
        this.encoding = type === 'STYLE' ? 'utf8' : 'binary'
        this.content = io.read(realpath, this.encoding)
        this.stamp = this.content && this.content.length
        this.type = type
    }

    save() {
        io.write(this.realpath, this.encoding)
    }
}

class Style extends File {
    constructor(realpath) {
        super({
            realpath,
            type: 'STYLE'
        })
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
}

class Sprite extends File {
    constructor(realpath, tag, dependences) {
        super({
            realpath,
            type: 'IMAGE'
        })

        this.tag = tag
        this.dependences = dependences
    }
}

export {Style, Image, Sprite}
