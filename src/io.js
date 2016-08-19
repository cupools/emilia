import path from 'path'
import fs from 'fs-extra'

export default {
    read(realpath, encode = 'utf8') {
        return fs.readFileSync(realpath, encode)
    },
    write(realpath, encode = 'utf8') {
        return fs.writeFileSync(realpath, encode)
    },
    realpath(subpath) {
        return path.resolve(process.cwd(), subpath)
    }
}
