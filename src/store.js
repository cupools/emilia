let Storage = {
    storage: {
        style: {},
        image: {}
    },
    add(file) {
        let t = file.type.toLowerCase()
        return this.storage[t] && (this.storage[t][file.realpath] = file)
    },
    get(realpath) {
        return this.storage.style[realpath] || this.storage.image[realpath] || null
    },
    get styles() {
        return this.storage.style
    },
    get images() {
        return this.storage.image
    }
}

export default {
    create() {
        return Object.assign({}, Storage)
    }
}
