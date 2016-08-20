import path from 'path'
import fs from 'fs-extra'

export default {
    read(realpath, encode = 'utf8') {
        try {
            return fs.readFileSync(realpath, encode === 'binary' ? undefined : encode)
        } catch (e) {}
        return null
    },
    write(realpath, content, encode = 'utf8') {
        return fs.writeFileSync(realpath, content, encode)
    },
    realpath(subpath) {
        return path.resolve(process.cwd(), subpath)
    }
}
