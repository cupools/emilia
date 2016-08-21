import postcss from 'postcss'
import path from 'path'

const INLINE = 'inline'
const URL_REG = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/
const replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/
const DECL_REMOVE_REG = /(-webkit-)?background-(size|repeat)/

/**
 * analyse stylesheet, get sprite tag and return a map
 */
export default {
    badge(store) {
        let styles = store.styles
        return Object.keys(styles).reduce((ret, realpath) => {
            let file = styles[realpath]
            return postcss(badge.bind(null, ret, file)).process(file.content).css && ret
        }, {})
    },
    process(store, options) {
        let styles = store.styles
        Object.keys(styles).forEach(realpath => {
            let file = styles[realpath]
            file.content = postcss(process.bind(null, store, file)).process(file.content).css
        })
    }
}

function badge(ret, file, root) {
    root.walkDecls(/background/, decl => {
        let [, url, flag, tag] = URL_REG.exec(decl.value) || []

        if (flag && url && tag) {
            let f = ret[file.realpath] = ret[file.realpath] || {}
            f[tag] = f[tag] || []
            f[tag].push(url)
        }
    })
}

function process(store, file, root) {
    root.walkDecls(/background/, decl => {
        let [, url, flag, tag] = URL_REG.exec(decl.value) || []
        if (!flag || !url || !tag) {
            return
        }

        if (tag === INLINE) {
            // TODO, absolute url
            let realpath = path.resolve(file.realpath, '..', url)
            let image = store.get(realpath)

            if (image) {
                let base64 = image.base64()
                decl.value = decl.value.replace(replaceUrlReg, `$1${base64}$3`)
            }

            return
        }

        let sprite = store.get(tag, 'tag')
        let meta = sprite.meta
        let chip = meta.coordinates[realpath]
        let pos = postcss.decl({
            prop: 'background-position',
            value: `${-chip.x / opt.convert}${opt.unit} ${-chip.y / opt.convert}${opt.unit}`
        })
        let size = postcss.decl({
            prop: 'background-size',
            value: `${meta.width / opt.convert}${opt.unit} ${meta.height / opt.convert}${opt.unit}`
        })

        url = sprite.url || `${opt.cssPath}${opt.prefix}${tag}.png`
        decl.value = decl.value.replace(urlReg, `url('${url}')`)

        let parent = decl.parent

        parent.walkDecls(decl => {
            if (DECL_REMOVE_REG.test(decl.prop)) {
                decl.remove()
            }
        })
        parent.append(pos)
        parent.append(size)
    })
}