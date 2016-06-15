'use strict';

import Emilia from '../emilia';

export default function() {
    let argv = process.argv.slice(2);
    let options = {};

    while(argv.length) {
        let cmd = argv.shift();

        switch(cmd) {
            case '--src':
            case '-s':
                options.src = argv.shift();
                options.src = options.src ? options.src.split(',') : [];
                break;

            case '--dest':
            case '-d':
                options.dest = argv.shift();
                break;

            case '--output':
            case '-o':
                options.output = argv.shift();
                break;

            case '--cssPath':
                options.cssPath = argv.shift();
                break;

            case '--prefix':
                options.prefix = argv.shift();
                break;

            case '--algorithm': 
                options.algorithm = argv.shift();
                break;

            case '--padding': 
                options.padding = argv.shift();
                break;

            case '--unit': 
                options.unit = argv.shift();
                break;

            case '--convert': 
                options.convert = argv.shift();
                break;

            case '--quiet': 
                options.quiet = argv.shift();
                break;
        }
    }

    let emilia = new Emilia(options);
    emilia.run();
}
