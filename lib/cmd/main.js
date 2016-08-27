'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var argv = process.argv.slice(2);
    var options = {};

    while (argv.length) {
        var cmd = argv.shift();

        switch (cmd) {
            case '--src':
            case '-s':
                var src = argv.shift();
                options.src = src ? src.split(',') : [];
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
                options.padding = Number(argv.shift());
                break;

            case '--unit':
                options.unit = argv.shift();
                break;

            case '--convert':
                options.convert = Number(argv.shift());
                break;

            case '--decimalPlaces':
                options.decimalPlaces = Number(argv.shift());
                break;

            case '--quiet':
                options.quiet = !!argv.shift();
                break;
        }
    }

    var emilia = new _emilia2.default(options);
    emilia.run();
};

var _emilia = require('../emilia');

var _emilia2 = _interopRequireDefault(_emilia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }