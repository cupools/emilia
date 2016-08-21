'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INLINE = 'inline';
var URL_REG = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/;
var replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/;
var DECL_REMOVE_REG = /(-webkit-)?background-(size|repeat)/;

/**
 * analyse stylesheet, get sprite tag and return a map
 */
exports.default = {
    badge: function badge(store) {
        var styles = store.styles;
        return (0, _keys2.default)(styles).reduce(function (ret, realpath) {
            var file = styles[realpath];
            return (0, _postcss2.default)(_badge.bind(null, ret, file)).process(file.content).css && ret;
        }, {});
    },
    process: function process(store, options) {
        var styles = store.styles;
        (0, _keys2.default)(styles).forEach(function (realpath) {
            var file = styles[realpath];
            file.content = (0, _postcss2.default)(_process.bind(null, store, file, options)).process(file.content).css;
        });
    }
};


function _badge(ret, file, root) {
    root.walkDecls(/background/, function (decl) {
        var _ref = URL_REG.exec(decl.value) || [];

        var _ref2 = (0, _slicedToArray3.default)(_ref, 4);

        var url = _ref2[1];
        var flag = _ref2[2];
        var tag = _ref2[3];


        if (flag && url && tag) {
            var f = ret[file.realpath] = ret[file.realpath] || {};
            f[tag] = f[tag] || [];
            f[tag].push(url);
        }
    });
}

function _process(store, file, _ref3, root) {
    var convert = _ref3.convert;
    var unit = _ref3.unit;

    root.walkDecls(/background/, function (decl) {
        var _ref4 = URL_REG.exec(decl.value) || [];

        var _ref5 = (0, _slicedToArray3.default)(_ref4, 4);

        var url = _ref5[1];
        var flag = _ref5[2];
        var tag = _ref5[3];

        if (!flag || !url || !tag) {
            return;
        }

        // TODO, absolute url
        var realpath = _path2.default.resolve(file.realpath, '..', url);
        var image = store.get(realpath);

        if (!image) {
            return;
        }

        if (tag === INLINE) {
            var base64 = image.base64();
            decl.value = decl.value.replace(replaceUrlReg, '$1' + base64 + '$3');
            return;
        }

        var sprite = store.get(tag, 'tag');
        var properties = sprite.properties;
        var coordinates = sprite.coordinates[realpath];

        var pos = _postcss2.default.decl({
            prop: 'background-position',
            value: '' + -coordinates.x / convert + unit + ' ' + -coordinates.y / convert + unit
        });
        var size = _postcss2.default.decl({
            prop: 'background-size',
            value: '' + properties.width / convert + unit + ' ' + properties.height / convert + unit
        });

        decl.value = decl.value.replace(URL_REG, 'url(\'' + sprite.url + '\')');

        var parent = decl.parent;
        parent.walkDecls(function (decl) {
            if (DECL_REMOVE_REG.test(decl.prop)) {
                decl.remove();
            }
        });
        parent.append(pos);
        parent.append(size);
    });
}