'use strict';

class File {
    constructor(attr) {
        attr.id = attr.id || attr.realpath;
        Object.assign(this, attr);
    }
}

let ctl = {
    storage: {
        style: {},
        sprite: {},
    },
    wrap(params) {
        let f = new File(params);
        let type = f.type.toLowerCase();
        let id = f.id;

        this.storage[type][id] = f;

        return f;
    },
    getFile(id) {
        return this.storage.style[id] || this.storage.sprite[id];
    },
    getStyles() {
        return this.storage.style;
    },
    getSprites() {
        return this.storage.sprite;
    },
    clear() {
        this.storage.style = {};
        this.storage.sprite = {};
    }
};

export default ctl;