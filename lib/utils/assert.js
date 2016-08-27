'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    typeOf: function typeOf(actual, expect, info) {
        if (Object.prototype.toString.call(actual).indexOf(expect.name) < 0) {
            _log2.default.error(info);
            return false;
        }
        return true;
    },
    oneOf: function oneOf(actual, expect, info) {
        if (expect.indexOf(actual) < 0) {
            _log2.default.error(info);
            return false;
        }
        return true;
    },
    isNotNull: function isNotNull(actual, info) {
        if (actual != null) {
            return true;
        }
        _log2.default.error(info);
        return false;
    }
};