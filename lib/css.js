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

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INLINE = 'inline';
var URL_REG = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/;
var replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/;
var DECL_REMOVE_REG = /(-webkit-)?background-(size|repeat)/;

/**
 * analyse stylesheet, get sprite tag and return a map
 */
exports.default = {
    badge: function badge(files) {
        return (0, _keys2.default)(files).reduce(function (ret, realpath) {
            var file = files[realpath];
            return (0, _postcss2.default)(_badge.bind(null, ret, file)).process(file.content).css && ret;
        }, {});
    },
    process: function process(files, options) {
        var _this = this;

        var processor = (0, _postcss2.default)(_process.bind(null, options));

        (0, _keys2.default)(files).forEach(function (file) {
            processor.use(_this._updateDecls.bind(_this, file));
            file.content = processor.process(file.content).css;

            _this.outputStyle(file);
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

function _process(options, root) {
    root.walkDecls(/background/, function (decl) {
        var _ref3 = URL_REG.exec(decl.value) || [];

        var _ref4 = (0, _slicedToArray3.default)(_ref3, 4);

        var url = _ref4[1];
        var flag = _ref4[2];
        var tag = _ref4[3];


        if (!flag) {
            return;
        }

        if (tag === INLINE) {
            // TODO
            var _realpath = io.realpath(url);
            var base64 = _image2.default.encode(_realpath);
            decl.value = decl.value.replace(replaceUrlReg, '$1' + base64 + '$3');
            return;
        }

        var sprite = sprite.getFile(tag);
        var meta = sprite.meta;
        var chip = meta.coordinates[realpath];
        var pos = _postcss2.default.decl({
            prop: 'background-position',
            value: '' + -chip.x / opt.convert + opt.unit + ' ' + -chip.y / opt.convert + opt.unit
        });
        var size = _postcss2.default.decl({
            prop: 'background-size',
            value: '' + meta.width / opt.convert + opt.unit + ' ' + meta.height / opt.convert + opt.unit
        });

        url = sprite.url || '' + opt.cssPath + opt.prefix + tag + '.png';
        decl.value = decl.value.replace(urlReg, 'url(\'' + url + '\')');

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