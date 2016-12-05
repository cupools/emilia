'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = process;

var _images = require('images');

var _images2 = _interopRequireDefault(_images);

var _layout = require('./utils/layout');

var _layout2 = _interopRequireDefault(_layout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */
var INFINITE = 10e9;
_images2.default.setLimit(INFINITE, INFINITE);

/**
 * build sprite images
 * @param  {Object} options padding & algorithm
 * @param  {Array} buffers   buffer of images
 * @return {Object}         coordinates & size
 */
function process(options, buffers) {
  var padding = options.padding;
  var algorithm = options.algorithm;

  var layer = (0, _layout2.default)(algorithm);

  var base64 = buffers.map(function (buffer) {
    return buffer.toString('base64');
  });
  buffers.forEach(function (buffer, index) {
    var parent = base64.slice(0, index).indexOf(base64[index]);
    var image = (0, _images2.default)(buffer);
    var size = image.size();

    layer.addItem({
      parent: parent,
      index: index,
      image: image,
      width: parent === -1 ? size.width + padding : 0,
      height: parent === -1 ? size.height + padding : 0
    });
  });

  var result = layer.export();

  var width = result.width - padding;
  var height = result.height - padding;
  var coordinates = result.items.map(function (item) {
    var parent = item.parent;

    var real = parent === -1 ? item : result.items[parent];
    var x = real.x;
    var y = real.y;


    return {
      x: x,
      y: y,
      width: real.width - padding,
      height: real.height - padding
    };
  });

  var sprite = (0, _images2.default)(width, height);
  result.items.forEach(function (_ref) {
    var image = _ref.image;
    var parent = _ref.parent;
    var x = _ref.x;
    var y = _ref.y;
    return parent === -1 && sprite.draw(image, x, y);
  });

  return {
    buffer: sprite.encode('png'),
    width: width,
    height: height,
    coordinates: coordinates
  };
}