import path from 'path'
import fs from 'fs-extra'

export default {
    read(realpath, encoding = 'utf8') {
        try {
            return fs.readFileSync(realpath, encoding === 'binary' ? undefined : encoding)
        } catch (e) {}
        return null
    },
    write(realpath, content, encoding = 'utf8') {
        return fs.writeFileSync(realpath, content, {encoding})
    },
    realpath(subpath) {
        return path.resolve(process.cwd(), subpath)
    }
}
