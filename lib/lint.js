'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (opt) {
    return schemes.every(function (rule) {
        var param = rule.param;
        var typeOf = rule.typeOf;
        var oneOf = rule.oneOf;
        var necessary = rule.necessary;

        var actual = opt[param];
        var ret = true;

        /* istanbul ignore next */
        if (typeOf) {
            ret = ret && _assert2.default.typeOf(actual, typeOf, param + ' should be ' + typeOf.name + ' but get `' + actual + '`');
        }
        if (oneOf) {
            ret = ret && _assert2.default.oneOf(actual, oneOf, param + ' should be one of [' + oneOf.join(', ') + '] but get `' + actual + '`');
        }
        if (necessary) {
            ret = ret && _assert2.default.isNotNull(actual, param + ' should not be null or undefined');
        }

        return ret;
    });
};

var _assert = require('./utils/assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schemes = [{
    param: 'src',
    typeOf: Array,
    necessary: true
}, {
    param: 'dest',
    typeOf: String
}, {
    param: 'output',
    typeOf: String
}, {
    param: 'cssPath',
    typeOf: String
}, {
    param: 'prefix',
    typeOf: String
}, {
    param: 'algorithm',
    typeOf: String,
    oneOf: ['binary-tree', 'top-down', 'left-right', 'diagonal', 'alt-diagonal']
}, {
    param: 'padding',
    typeOf: Number
}, {
    param: 'unit',
    typeOf: String
}, {
    param: 'convert',
    typeOf: Number
}, {
    param: 'decimal',
    typeOf: Number
}, {
    param: 'quiet',
    typeOf: Boolean
}];