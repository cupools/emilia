'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var usage = ['', '  Usage: emilia [options] [command]', '', '  Commands:', '', '    help                   Output usage information', '', '  Options:', '', '    -s, --src <src>        stylesheet path, use glob patterns', '    -d, --dest <dir>       output compiled stylesheet file to <dir>', '    -o, --output <dir>     output sprite pictures to <dir>', '    --cssPath              image url path', '    --prefix               prefix sprite pictures\' basename', '    --algorithm            layout algorithm of sprite pictures', '    --padding              padding between images', '    --convert              numerical scale', '    --unit                 unit of backgound-size and position', '    --quiet                disabled output info in the console', ''].join('\n');

    (0, _log2.default)(usage);
};

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }