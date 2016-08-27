import glob from 'glob'
import path from 'path'

import Store from './store'
import css from './css'
import io from './io'
import lint from './lint'
import log from './utils/log'
import { Style, Image, Sprite } from './file'

class Emilia {
    constructor(options) {
        this.options = Object.assign({
            src: ['**/*.css'],
            dest: 'build/css/',
            output: 'build/images/',
            cssPath: '../images/',
            prefix: '',
            algorithm: 'binary-tree',
            padding: 10,
            unit: 'px',
            convert: 1,
            decimalPlaces: 6,
            quiet: false
        }, options)

        this.store = Store.create()
        log.trigger(this.options.quiet)
    }

    run() {
        let {store, options} = this

        if (!lint(options)) {
            return false
        }

        this.collect()
        let cssMap = css.badge(store)
        let spriteMap = this.pack(cssMap)

        this.process(spriteMap)
        css.process(store, options)

        this.output()
    }

    collect() {
        let {store, options} = this

        this._getResource().forEach(subpath => {
            let realpath = io.realpath(subpath)
            let style = new Style(realpath, options)
            store.add(style)
        })
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
                    ret[tag].filter(item => item.realpath === image.realpath).length === 0 && ret[tag].push(image)
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
            let old = Store.fromCache(tag, 'tag')
            if (old && old.equal(sprite)) {
                sprite.coordinates = old.coordinates
                sprite.properties = old.properties
                sprite.content = old.content
            } else {
                sprite.build()
            }

            store.add(sprite, 'tag')
            Store.cache(sprite, 'tag')
        })
    }

    output() {
        let {store} = this
        Object.keys(store.styles).forEach(f => store.styles[f].save())
        Object.keys(store.sprites).forEach(f => store.sprites[f].save())
    }

    _getResource() {
        let {src} = this.options
        let styles = src.reduce((ret, pattern) => {
            let map = glob.sync(pattern)

            if (map.length) {
                ret.push(...map)
            }

            return ret
        }, [])

        return [...new Set(styles)]
    }
}

export default Emilia
