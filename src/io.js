import path from 'path'
import fs from 'fs-extra'

export default {
    read(realpath, encode = 'utf8') {
        try {
            return fs.readFileSync(realpath, encode === 'buffer' ? undefined : encode)
        } catch (e) {}
        return null
    },
    write(realpath, encode = 'utf8') {
        return fs.writeFileSync(realpath, encode)
    },
    realpath(subpath) {
        return path.resolve(process.cwd(), subpath)
    },
    subpath(realpath) {
        return realpath.replace(process.cwd() + '/', '')
    }
}
