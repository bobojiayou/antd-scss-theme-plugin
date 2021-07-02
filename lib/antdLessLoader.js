"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = antdLessLoader;
exports.overloadLessLoaderOptions = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lessLoader = _interopRequireDefault(require("less-loader"));

var _loaderUtils = require("loader-utils");

var _utils = require("./utils");

var _loaderUtils2 = require("./loaderUtils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Modify less-loader's options with variable overrides extracted from the SCSS theme.
 * @param {Object} options - Options for less-loader.
 * @return {Object} Options modified to include theme variables in the modifyVars property.
 */
var overloadLessLoaderOptions = function overloadLessLoaderOptions(options) {
  var scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
  var themeModifyVars = (0, _utils.loadScssThemeAsLess)(scssThemePath);

  var newOptions = _objectSpread(_objectSpread({}, options), {}, {
    modifyVars: _objectSpread(_objectSpread({}, themeModifyVars), options.modifyVars || {})
  });

  return newOptions;
};
/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */


exports.overloadLessLoaderOptions = overloadLessLoaderOptions;

function antdLessLoader() {
  var loaderContext = this;
  var options = (0, _loaderUtils.getOptions)(loaderContext);

  var newLoaderContext = _objectSpread({}, loaderContext);

  try {
    var newOptions = overloadLessLoaderOptions(options);
    delete newOptions.scssThemePath;
    newLoaderContext.query = newOptions;
  } catch (error) {
    // Remove unhelpful stack from error.
    error.stack = undefined; // eslint-disable-line no-param-reassign

    throw error;
  }

  var scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
  newLoaderContext.addDependency(scssThemePath);

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _lessLoader["default"].call.apply(_lessLoader["default"], [newLoaderContext].concat(args));
}