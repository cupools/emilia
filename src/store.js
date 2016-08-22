let Cache = {}
class Storage {
    constructor() {
        this.storage = {
            style: {},
            image: {},
            sprite: {}
        }
    }
    add(file, unique = 'realpath') {
        let t = file.type.toLowerCase()
        return this.storage[t] && (this.storage[t][file[unique]] = file)
    }
    get(unique) {
        return this.storage.sprite[unique] || this.storage.style[unique] || this.storage.image[unique] || null
    }
    get styles() {
        return this.storage.style
    }
    get images() {
        return this.storage.image
    }
    get sprites() {
        return this.storage.sprite
    }
}

export default {
    create() {
        return new Storage()
    },
    cache(file, unique = 'realpath') {
        Cache[file[unique]] = file
    },
    fromCache(unique) {
        return Cache[unique] || null
    }
}
