'use strict';

import colors from 'colors';
import path from 'path';

let quiet = false;

let log = function(msg) {
    log.console(msg);
};

log.console = function(msg) {
    if(!quiet) {
        console.log(msg);
    }
};

log.info = function(msg) {
    log.console('[info]: ' + msg);
};

log.warn = function(msg) {
    log.console('[warn]: ' + colors.yellow(msg));
};

log.error = function(msg) {
    log.console('[error]: ' + colors.red(msg));
};

log.build = function(msg) {
    let format = path.join('.', msg);
    log.info('Created ' + colors.green(format));
};

log.trigger = function(stat) {
    quiet = !!stat;
};

export default log;