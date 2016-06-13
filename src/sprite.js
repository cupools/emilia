'use strict';

import child from 'child_process';
import path from 'path';
import _ from './utils/util';

let storage = {};

class Sprite {
    constructor(tag) {
        this.tag = tag;
        this.dependences = [];
        this.properties = null;
        this.coordinates = null;
        this.image = null;
    }

    add(realpath) {
        if(this.dependences.indexOf(realpath) === -1) {
            this.dependences.push(realpath);
        }
    }

    process(options) {
        let {properties, coordinates, image} = processSprite({
            options,
            tag: this.tag,
            sprites: this.dependences
        });

        Object.assign(this, {properties, coordinates, image});
    }
}

function processSprite({tag, sprites, options}) {
    let ret = child.execFileSync(path.join(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)]);
    let result = JSON.parse(ret.toString());
    storage[tag] = result;

    return result;
}

function build(opt, callback) {
    _.forIn(storage, sprite => {
        sprite.process(opt);
        callback(sprite);
    });
}

function add(realpath, tag) {
    if(!storage[tag]) {
        storage[tag] = new Sprite(tag);
    }

    storage[tag].add(realpath);
}

function get(tag) {
    return tag ? storage[tag] : storage;
}

export {build, add, get};