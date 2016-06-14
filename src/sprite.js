'use strict';

import child from 'child_process';
import _ from './utils/util';

let asserts = {};
let cache = {};

class Sprite {
    constructor(tag) {
        this.tag = tag;
        this.dependences = [];
        this.properties = null;
        this.coordinates = null;
        this.image = null;
        this.stamp = '';
    }

    add(realpath, stamp) {
        if(this.dependences.indexOf(realpath) === -1) {
            this.dependences.push(realpath);
            this.mark(stamp);
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

    equal(obj) {
        return obj && this.tag === obj.tag && this.stamp === obj.stamp;
    }

    mark(stamp) {
        this.stamp += stamp;
    }
}

function processSprite({tag, sprites, options}) {
    let ret = child.execFileSync(_.join(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)]);
    let result = JSON.parse(ret.toString());

    return result;
}

function shouldRebuild() {
    let ret = false;

    _.forIn(asserts, (sprite, tag) => {
        let old = cache[tag];

        if(!old || !sprite.equal(old)) {
            ret = true;
            return false;
        }
    });

    return ret;
}

export default {
    build(opt, callback) {
        if(shouldRebuild()) {
            _.forIn(asserts, sprite => {
                sprite.process(opt);
            });
        } else {
            asserts = cache;
            cache = {};
        }

        _.forIn(asserts, sprite => {
            callback(sprite);
        });
    },
    add(tag, realpath, stamp) {
        if(!asserts[tag]) {
            asserts[tag] = new Sprite(tag);
        }

        asserts[tag].add(realpath, stamp);
    },
    get(tag) {
        return tag ? asserts[tag] : asserts;
    },
    save() {
        cache = asserts;
        this.clear();
    },
    clear() {
        asserts = {};
    }
};