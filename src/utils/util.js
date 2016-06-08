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
    resolvePath(...p) {
        return path.resolve.apply(null, [process.cwd(), ...p]);
    },
    relativePath(...p) {
        return path.relative(...p);
    },
    joinPath(...p) {
        return path.resolve(process.cwd(), path.join.apply(null, p));
    },
    exists(p) {
        let ret = true;
        try {
            fs.statSync(p);
        } catch (e) {
            ret = false;
        }
        return ret;
    }
});