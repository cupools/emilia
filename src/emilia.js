import fs from 'fs-extra'
import glob from 'glob'
import postcss from 'postcss'
import _ from 'lodash'

import store from './store'
import css from './css'
import sprite from './sprite'
import io from './io'
import log from './utils/log'

class Emilia {
    constructor(options) {
        this.options = Object.assign({
            src: ['**/*.css'],
            dest: 'build/css/',
            output: 'build/images/',
            cssPath: '../images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            unit: 'px',
            convert: 1,
            quiet: false
        }, options)

        this.store = store.create()
        log.trigger(this.options.quiet)
    }

    run() {
        this.collect()
        this.process()
    }

    collect() {
        this._getResource().forEach(subpath => {
            let realpath = io.realpath(subpath)
            let content = io.read(realpath)
            let stamp = content.length

            store.add({
                subpath,
                realpath,
                content,
                stamp
            })
        })

        css.badge(store.style)
    }

    process() {
        this._buildSprite()
        this._outputSprite()
        this._outputStyle()
    }

    _buildSprite() {
        let opt = this.options

        sprite.build(opt, sp => {
            let path = _.join(opt.output, opt.prefix + sp.tag + '.png')
            let content = new Buffer(sp.image)

            File.wrap({
                path,
                content,
                id: sp.tag,
                sprite: sp,
                type: 'SPRITE',
                meta: {
                    width: sp.properties.width,
                    height: sp.properties.height,
                    coordinates: sp.coordinates
                }
            })
        })
    }

    _outputSprite() {
        let sprites = store.sprite
        _.forIn(sprites, file => this.outputSprite(file))
    }

    _outputStyle() {
        let processor = postcss()
        let styles = store.styles
        // css.process
    }

    outputStyle(file) {
        let opt = this.options
        let name = _.basename(file.realpath)
        let outputPath = _.join(opt.dest, name)
        let outputRealpath = _.resolve(outputPath)

        if (_.exists(outputRealpath)) {
            outputPath = _.join(opt.dest, name)
            outputRealpath = _.resolve(outputPath)
        }

        fs.outputFileSync(outputRealpath, file.content, 'utf8')
        log.build(outputPath)
    }

    outputSprite(file) {
        let opt = this.options
        let name = file.id
        let outputPath = _.resolve(opt.output, name + '.png')

        fs.outputFileSync(outputPath, file.content, 'binary')
        log.build(file.path)
    }

    _getResource() {
        let {src} = this.options
        let styles = src.reduce((ret, pattern) => ret.push(...glob.sync(pattern)) && ret, [])

        return _.uniq(styles)
    }
}

export default Emilia
