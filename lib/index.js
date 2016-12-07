'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = emilia;

var _proof = require('proof');

var _proof2 = _interopRequireDefault(_proof);

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

var _lint = require('./lint');

var _lint2 = _interopRequireDefault(_lint);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emilia() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var content = arguments[1];

  var options = (0, _proof2.default)(opts, _lint2.default);
  var resolveUrl = options.resolveUrl;
  var detectUrl = options.detectUrl;
  var getBuffer = options.getBuffer;
  var getUrls = options.getUrls;
  var algorithm = options.algorithm;
  var padding = options.padding;

  var processor = _sprite2.default.bind(null, { algorithm: algorithm, padding: padding });

  var _getUrls = getUrls(content);

  var root = _getUrls.root;
  var urls = _getUrls.urls;


  var assignTag = function assignTag(item) {
    return (0, _extends3.default)({}, item, detectUrl(item.url));
  };
  var assignLocate = function assignLocate(item) {
    return (0, _extends3.default)({}, item, { locate: resolveUrl(item.url) });
  };
  var assignBuffer = function assignBuffer(item) {
    return (0, _extends3.default)({}, item, { buffer: getBuffer(item.locate) });
  };
  var prune = function prune(item) {
    return item.tag && item.locate && item.buffer;
  };

  var bundles = urls.map(_util2.default.map(assignBuffer, assignLocate, assignTag)).filter(prune);

  var getID = options.getID;
  var getGroup = options.getGroup;
  var getSprite = options.getSprite;
  var getContent = options.getContent;

  var assignID = function assignID(item) {
    return (0, _extends3.default)({}, item, { id: getID(bundles, item) });
  };
  var assignGroup = function assignGroup(item) {
    return (0, _extends3.default)({}, item, { group: getGroup(bundles, item.tag) });
  };
  var assignSprite = function assignSprite(item) {
    return (0, _extends3.default)({}, item, { sprite: getSprite(processor, bundles, item.group) });
  };

  var publicPath = options.publicPath;

  var result = _util2.default.maps(assignSprite, assignGroup, assignID)(bundles);
  var ret = getContent({ publicPath: publicPath }, root, result);

  return {
    content: ret,
    items: result
  };
}