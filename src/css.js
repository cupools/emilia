import postcss from 'postcss'
import path from 'path'

const INLINE = 'inline'
const URL_REG = /(?:url\s?\(['"]?([\w\W]+?)(?:(\?__)?([\w\d\-_]+?))?['"]?\))/
const URL_REPLACE_REG = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/
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
            file.content = postcss(process.bind(null, store, file, options)).process(file.content).css
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

function process(store, file, {convert, unit, decimal}, root) {
    // TODO hook
    root.walkDecls(/background/, decl => {
        let [, url, flag, tag] = URL_REG.exec(decl.value) || []
        if (!flag || !url || !tag) {
            return
        }

        // TODO, absolute url
        let realpath = path.resolve(file.realpath, '..', url)
        let image = store.get(realpath)

        if (!image) {
            decl.value = decl.value.replace(flag + tag, '')
            return
        }

        if (tag === INLINE) {
            let base64 = image.base64()
            decl.value = decl.value.replace(URL_REPLACE_REG, `$1${base64}$3`)
            return
        }

        let sprite = store.get(tag, 'tag')
        let properties = sprite.properties
        let coordinates = sprite.coordinates[realpath]

        let [x, y, width, height] = [-coordinates.x, -coordinates.y, properties.width, properties.height].map(decimalFixed)

        let pos = postcss.decl({
            prop: 'background-position',
            value: `${x}${unit} ${y}${unit}`
        })
        let size = postcss.decl({
            prop: 'background-size',
            value: `${width}${unit} ${height}${unit}`
        })

        decl.value = decl.value.replace(URL_REG, `url('${sprite.url}')`)

        let parent = decl.parent
        parent.walkDecls(DECL_REMOVE_REG, decl => decl.remove())
        parent.append(pos)
        parent.append(size)
    })

    function decimalFixed(num) {
        return convert === 1 ? num : Number((num / convert).toFixed(decimal))
    }
}
