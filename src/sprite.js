'use strict';

import child from 'child_process';
import path from 'path';

function processSprite({sprites, options}) {
    let ret = child.execFileSync(path.join(__dirname, 'spritesmith'), ['-sprites', JSON.stringify(sprites), '-options', JSON.stringify(options)]);
    let result = JSON.parse(ret.toString());
    return result;
}

export {processSprite};