import glob from 'glob'
import _ from 'lodash'
import path from 'path'

import Store from './store'
import css from './css'
import io from './io'
import log from './utils/log'

import { Style, Image, Sprite } from './file'

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

        this.store = Store.create()
        log.trigger(this.options.quiet)
    }

    run() {
        let cssMap = this.collect()
        let spriteMap = this.pack(cssMap)

        this.process(spriteMap)
    }

    collect() {
        let {store} = this

        this._getResource().forEach(subpath => {
            let realpath = io.realpath(subpath)
            let style = new Style(realpath)
            store.add(style)
        })

        return css.badge(store.styles)
    }

    pack(cssMap) {
        let {store} = this

        return Object.keys(cssMap).reduce((ret, realpath) => {
            let tags = cssMap[realpath]
            return Object.keys(tags).reduce((ret, tag) => {
                let urls = tags[tag]
                urls.forEach(url => {
                    let imageRealpath = path.resolve(realpath, '..', url)
                    let image = new Image(imageRealpath, url)

                    if (!image.content) {
                        log.error(`\`${url}\` not found`)
                        return
                    }

                    store.add(image)

                    ret[tag] = ret[tag] || []
                    ret[tag].indexOf(image) === -1 && ret[tag].push(image)
                })

                return ret
            }, ret)
        }, {})
    }

    process(spriteMap) {
        let {dest, prefix, padding, algorithm, cssPath} = this.options
        let {store} = this

        Object.keys(spriteMap).forEach(tag => {
            let dependence = spriteMap[tag]
            let basename = prefix + tag + '.png'
            let realpath = path.resolve(dest, basename)

            let sprite = new Sprite(realpath, tag, dependence, {
                padding,
                algorithm,
                cssPath
            })

            // cache only sprite
            let old = Store.fromCache(realpath)
            if (old && old.stamp === sprite.stamp) {
                store.add(old)
            } else {
                sprite.build()
                store.add(sprite)
                Store.cache(sprite)
            }
        })
    }

    _getResource() {
        let {src} = this.options
        let styles = src.reduce((ret, pattern) => ret.push(...glob.sync(pattern)) && ret, [])

        return _.uniq(styles)
    }
}

export default Emilia
