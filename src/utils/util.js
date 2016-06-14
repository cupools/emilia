'use strict';

import path from 'path';
import fs from 'fs-extra';
import * as lodash from 'lodash';

export default Object.assign(lodash, {
    basename(p) {
        return path.basename(p);
    },
    name(p) {
        return path.basename(p).replace(/\.[\w\d]+$/, '');
    },
    resolve(...p) {
        return path.resolve.apply(null, [process.cwd(), ...p]);
    },
    relative(...p) {
        return path.relative(...p);
    },
    join(...p) {
        return path.join(...p);
    },
    exists(p) {
        return this.statSync(p);
    },
    statSync(p) {
        let ret = false;
        try {
            ret = fs.statSync(p);
        } catch (e) {
            ret = false;
        }
        return ret;
    }
});