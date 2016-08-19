let Storage = {
    storage: {
        style: {},
        image: {}
    },
    add(item, type) {
        let t = type.toLowerCase()
        return this.storage[t] && (this.storage[t][item.realpath] = item)
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
