'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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
 * @param  {Array} files   buffer of images
 * @param  {Object} options padding & algorithm
 * @return {Object}         coordinates & size
 */
function process(files, options) {
  var padding = options.padding;
  var algorithm = options.algorithm;

  var layer = (0, _layout2.default)(algorithm);

  files.forEach(function (file) {
    var img = (0, _images2.default)(file.content);
    var size = img.size();
    var meta = { file: file, img: img };

    var item = (0, _extends3.default)({}, meta, {
      width: size.width + padding,
      height: size.height + padding
    });

    layer.addItem(item);
  });

  var _layer$export = layer.export();

  var items = _layer$export.items;

  var width = layer.width - padding;
  var height = layer.height - padding;
  var sprite = (0, _images2.default)(width, height);

  var properties = { width: width, height: height };
  var coordinates = {};

  items.forEach(function (item) {
    var file = item.file;
    var img = item.img;
    var x = item.x;
    var y = item.y;


    coordinates[file.realpath] = {
      x: x,
      y: y,
      width: item.width - padding,
      height: item.height - padding
    };

    sprite.draw(img, x, y);
  });

  return {
    image: sprite.encode('png'),
    coordinates: coordinates,
    properties: properties
  };
}