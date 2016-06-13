'use strict';

import child from 'child_process';
import path from 'path';

let storage = {};

function processSprite({tag, sprites, options}) {
    let ret = child.execFileSync(path.join(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)]);
    let result = JSON.parse(ret.toString());
    storage[tag] = result;
    return result;
}

export {processSprite};