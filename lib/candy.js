'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = candy;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _proof2 = require('proof');

var _proof3 = _interopRequireDefault(_proof2);

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


  console.log(content);
}