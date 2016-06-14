'use strict';

class File {
    constructor(attr) {
        attr.id = attr.id || identity();
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

function identity() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

export default ctl;