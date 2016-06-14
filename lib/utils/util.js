'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _lodash = require('lodash');

var lodash = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Object.assign(lodash, {
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
});