'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = candy;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _proof2 = require('proof');

var _proof3 = _interopRequireDefault(_proof2);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lints = {
  src: {
    required: true,
    typeOf: 'string',
    satisfy: function satisfy(p) {
      return _fs2.default.existsSync(p);
    }
  },
  dest: {
    required: true,
    typeOf: 'string'
  },
  output: {
    required: true,
    typeOf: 'string'
  }
};

function candy(opts) {
  var _proof = (0, _proof3.default)(opts, lints);

  var src = _proof.src;
  var dest = _proof.dest;
  var output = _proof.output;
  var options = (0, _objectWithoutProperties3.default)(_proof, ['src', 'dest', 'output']);

  var _emilia = (0, _index2.default)(options, _fs2.default.readFileSync(src, 'utf8'));

  var content = _emilia.content;
  var items = _emilia.items;


  writeFile(content, 'utf8', dest);
  items.forEach(function (item) {
    var id = item.id;
    var group = item.group;
    var sprite = item.sprite;
    var tag = item.tag;

    if (group.indexOf(id) === 0) {
      writeFile(sprite.buffer, 'base64', output, tag + '.png');
    }
  });

  return {
    content: content,
    items: items
  };
}

function writeFile(content, encoding) {
  for (var _len = arguments.length, p = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    p[_key - 2] = arguments[_key];
  }

  var output = _path2.default.join.apply(_path2.default, p);
  _mkdirp2.default.sync(_path2.default.dirname(output.replace(/\/\w+?\.\w+$/, '') + '/__'));

  return _fs2.default.writeFileSync(output, content, encoding);
}