'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    read: function read(realpath) {
        var encoding = arguments.length <= 1 || arguments[1] === undefined ? 'utf8' : arguments[1];

        try {
            return _fsExtra2.default.readFileSync(realpath, encoding === 'binary' ? undefined : encoding);
        } catch (e) {}
        return null;
    },
    write: function write(realpath, content) {
        var encoding = arguments.length <= 2 || arguments[2] === undefined ? 'utf8' : arguments[2];

        return _fsExtra2.default.writeFileSync(realpath, content, { encoding: encoding });
    },
    realpath: function realpath(subpath) {
        return _path2.default.resolve(process.cwd(), subpath);
    }
};