'use strict';

import log from '../utils/log';

export default function () {
    let usage = [
        '',
        '  Usage: emilia [options] [command]',
        '',
        '  Commands:',
        '',
        '    help                   Output usage information',
        '',
        '  Options:',
        '',
        '    -s, --src <src>        stylesheet path, use glob patterns',
        '    -d, --dest <dir>       output compiled stylesheet file to <dir>',
        '    -o, --output <dir>     output sprite images to <dir>',
        '    --cssPath              image url path',
        '    --prefix               prefix sprite images\' basename',
        '    --algorithm            layout algorithm of sprite image',
        '    --padding              padding between images',
        '    --convert              numerical scale',
        '    --unit                 unit of backgound-size and position',
        '    --quiet                disabled output info in the console',
        ''
    ].join('\n');

    log(usage);
}
