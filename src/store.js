let Cache = {}
let Storage = {
    storage: {
        style: {},
        image: {},
        sprite: {}
    },
    add(file) {
        let t = file.type.toLowerCase()
        return this.storage[t] && (this.storage[t][file.realpath] = file)
    },
    get(realpath) {
        return this.storage.sprite[realpath] || this.storage.style[realpath] || this.storage.image[realpath] || null
    },
    get styles() {
        return this.storage.style
    },
    get images() {
        return this.storage.image
    },
    get sprites() {
        return this.storage.sprite
    }
}

export default {
    create() {
        return Object.assign({}, Storage)
    },
    cache(file) {
        Cache[file.realpath] = file
    },
    fromCache(realpath) {
        return Cache[realpath] || null
    }
}
