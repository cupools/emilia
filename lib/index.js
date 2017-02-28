'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emilia;

var _checkin = require('checkin');

var _checkin2 = _interopRequireDefault(_checkin);

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emilia(opts, content) {
  var options = (0, _checkin2.default)(opts, _lint2.default);
  var resolveUrl = options.resolveUrl;
  var detectUrl = options.detectUrl;
  var getBuffer = options.getBuffer;
  var getUrls = options.getUrls;

  var _getUrls = getUrls(content);

  var root = _getUrls.root;
  var urls = _getUrls.urls;


  var assignTag = function assignTag(item) {
    return _util2.default.assign(item, detectUrl(item.url));
  };
  var assignLocate = function assignLocate(item) {
    return _util2.default.assign(item, { locate: resolveUrl(item.url) });
  };
  var assignBuffer = function assignBuffer(item) {
    return _util2.default.assign(item, { buffer: getBuffer(item.locate) });
  };
  var prune = function prune(item) {
    return item.tag && item.locate && item.buffer;
  };

  var bundles = urls.map(_util2.default.map(assignBuffer, assignLocate, assignTag)).filter(prune);

  var getID = options.getID;
  var getGroup = options.getGroup;
  var getSprite = options.getSprite;
  var getContent = options.getContent;
  var getSpriteResult = options.getSpriteResult;
  var algorithm = options.algorithm;
  var padding = options.padding;

  var processor = _sprite2.default.bind(null, { algorithm: algorithm, padding: padding });

  var assignID = function assignID(item) {
    return _util2.default.assign(item, { id: getID(bundles, item) });
  };
  var assignGroup = function assignGroup(item) {
    return _util2.default.assign(item, { group: getGroup(bundles, item.tag) });
  };
  var assignSprite = function assignSprite(item) {
    return _util2.default.assign(item, { sprite: getSprite(processor, bundles, item.group) });
  };

  var publicPath = options.publicPath;

  var items = _util2.default.maps(assignSprite, assignGroup, assignID)(bundles);
  var ret = getContent({ publicPath: publicPath }, root, items);
  var sprites = getSpriteResult(items);

  return {
    content: ret,
    sprites: sprites,
    items: items
  };
}