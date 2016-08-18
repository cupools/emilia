import postcss from 'postcss'
import sprite from './sprite'
import image from './image'

const INLINE = 'inline'
const URL_REG = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/
const replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/
const DECL_REMOVE_REG = /(-webkit-)?background-(size|repeat)/

/**
 * analyse stylesheet, get sprite tag and return a map
 */
export default {
    badge(files) {
        let ret = {}
        let processor = postcss(root => {
            badge(root, ret)
        })

        files.forEach(file => {
            file.content = processor.process(file.content).css
        })
    },
    process(files, options) {
        let processor = postcss(process.bind(null, options))

        Object.keys(files).forEach(file => {
            processor.use(this._updateDecls.bind(this, file))
            file.content = processor.process(file.content).css

            this.outputStyle(file)
        })
    }
}

function badge(root, ret) {
    root.walkDecls(/background/, decl => {
        let [, url, flag, tag] = URL_REG.exec(decl.value) || []

        if (!flag) {
            return
        }

        if (url && tag) {
            if (!ret[tag]) {
                ret[tag] = []
            }

            ret[tag].push(url)
        }
    })
}

function process(options, root) {
    root.walkDecls(/background/, decl => {
        let [, url, flag, tag] = URL_REG.exec(decl.value) || []

        if (!flag) {
            return
        }

        if (tag === INLINE) {
            // TODO
            let realpath = io.realpath(url)
            let base64 = image.encode(realpath)
            decl.value = decl.value.replace(replaceUrlReg, `$1${base64}$3`)
            return
        }

        let sprite = sprite.getFile(tag)
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
    }))
}