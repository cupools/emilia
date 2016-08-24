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
var URL_REG = /(?:url\s?\(['"]?([\w\W]+?)(?:(\?__)?([\w\d\-_]+?))?['"]?\))/;
var URL_REPLACE_REG = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/;
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
    var decimalPlaces = _ref3.decimalPlaces;

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
            decl.value = decl.value.replace(flag + tag, '');
            return;
        }

        if (tag === INLINE) {
            var base64 = image.base64();
            decl.value = decl.value.replace(URL_REPLACE_REG, '$1' + base64 + '$3');
            return;
        }

        var sprite = store.get(tag, 'tag');
        var properties = sprite.properties;
        var coordinates = sprite.coordinates[realpath];

        var _map = [-coordinates.x, -coordinates.y, properties.width, properties.height].map(decimal);

        var _map2 = (0, _slicedToArray3.default)(_map, 4);

        var x = _map2[0];
        var y = _map2[1];
        var width = _map2[2];
        var height = _map2[3];


        var pos = _postcss2.default.decl({
            prop: 'background-position',
            value: '' + x + unit + ' ' + y + unit
        });
        var size = _postcss2.default.decl({
            prop: 'background-size',
            value: '' + width + unit + ' ' + height + unit
        });

        decl.value = decl.value.replace(URL_REG, 'url(\'' + sprite.url + '\')');

        var parent = decl.parent;
        parent.walkDecls(DECL_REMOVE_REG, function (decl) {
            return decl.remove();
        });
        parent.append(pos);
        parent.append(size);
    });

    function decimal(num) {
        return convert === 1 ? num : Number((num / convert).toFixed(decimalPlaces));
    }
}