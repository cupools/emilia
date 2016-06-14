'use strict';

let asserts = {
    style: {},
    sprite: {}
};

class File {
    constructor(attr) {
        attr.id = attr.id || identity();
        Object.assign(this, attr);
    }
}

function wrap(params) {
    let f = new File(params);
    let type = f.type.toLowerCase();
    let id = f.id;

    asserts[type][id] = f;

    return f;
}

function getFile(id) {
    return asserts.style[id] || asserts.sprite[id];
}

function getStyles() {
    return asserts.style;
}

function getSprites() {
    return asserts.sprite;
}

function identity() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

export {wrap, getStyles, getSprites, getFile};