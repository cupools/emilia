'use strict';

import fs from 'fs-extra';
import _ from './utils/util';
import log from './utils/log';

let asserts = {
    style: {},
    image: {},
    sprite: {}
};

class File {
    constructor({id, path, content, type, realPath}) {
        id = path;
        Object.assign(this, {id, path, type, content, realPath});
    }
}

function wrap(params) {
    let f = new File(params);
    let type = f.type.toLowerCase();
    let id = f.id;

    asserts[type][id] = f;

    return f;
}

function getStyles() {
    return asserts.style;
}

function getImages() {
    return asserts.image;
}

function getSprites() {
    return asserts.sprite;
}

export {wrap, getStyles, getImages, getSprites};