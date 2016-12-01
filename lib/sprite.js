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
 * @param  {Array} files   buffer of images
 * @return {Object}         coordinates & size
 */
function process(options, files) {
  var padding = options.padding;
  var algorithm = options.algorithm;

  var layer = (0, _layout2.default)(algorithm);

  files.forEach(function (file, index) {
    var image = (0, _images2.default)(file);
    var size = image.size();

    var item = {
      index: index,
      image: image,
      width: size.width + padding,
      height: size.height + padding
    };

    layer.addItem(item);
  });

  var result = layer.export();
  var width = result.width - padding;
  var height = result.height - padding;
  var properties = { width: width, height: height };
  var coordinates = result.items.map(function (item) {
    var x = item.x;
    var y = item.y;

    return {
      x: x,
      y: y,
      width: item.width - padding,
      height: item.height - padding
    };
  });

  var sprite = (0, _images2.default)(width, height);
  result.items.forEach(function (_ref) {
    var image = _ref.image;
    var x = _ref.x;
    var y = _ref.y;
    return sprite.draw(image, x, y);
  });

  return {
    image: sprite.encode('png'),
    coordinates: coordinates,
    properties: properties
  };
}