"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScssThemePath = void 0;

var _index = _interopRequireDefault(require("./index"));

/**
 * Get path to SCSS theme file specified in loader options or through the plugin's constructor.
 * @param {Object} options - Loader options.
 * @return {string} Path to SCSS theme file.
 */
// eslint-disable-next-line import/prefer-default-export
var getScssThemePath = function getScssThemePath(options) {
  var scssThemePath = options.scssThemePath || _index["default"].SCSS_THEME_PATH;

  if (!scssThemePath) {
    throw new Error('Path to an SCSS theme file must be specified through the scssThemePath loader option, ' + 'or passed to the plugin\'s constructor.');
  }

  return scssThemePath;
};

exports.getScssThemePath = getScssThemePath;