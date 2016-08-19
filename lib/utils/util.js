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
    basename: function basename(p) {
        return _path2.default.basename(p);
    },
    name: function name(p) {
        return _path2.default.basename(p).replace(/\.[\w\d]+$/, '');
    },
    resolve: function resolve() {
        for (var _len = arguments.length, p = Array(_len), _key = 0; _key < _len; _key++) {
            p[_key] = arguments[_key];
        }

        return _path2.default.resolve.apply(null, [process.cwd()].concat(p));
    },
    relative: function relative() {
        return _path2.default.relative.apply(_path2.default, arguments);
    },
    join: function join() {
        return _path2.default.join.apply(_path2.default, arguments);
    },
    exists: function exists(p) {
        return this.statSync(p);
    },
    statSync: function statSync(p) {
        var ret = false;
        try {
            ret = _fsExtra2.default.statSync(p);
        } catch (e) {
            ret = false;
        }
        return ret;
    }
};