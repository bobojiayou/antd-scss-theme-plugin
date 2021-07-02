"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var SharkrThemePlugin = /*#__PURE__*/function () {
  function SharkrThemePlugin(scssThemePath) {
    (0, _classCallCheck2["default"])(this, SharkrThemePlugin);
    this.SCSS_THEME_PATH = void 0;
    SharkrThemePlugin.SCSS_THEME_PATH = scssThemePath;
  }
  /**
   * Explicitly add the SCSS theme file to file dependencies.
   * @param {Object} compiler - A webpack compiler.
   * @return {undefined}
   */


  (0, _createClass2["default"])(SharkrThemePlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var afterEmit = function afterEmit(compilation, callback) {
        // Watch the theme file for changes.
        var theme = SharkrThemePlugin.SCSS_THEME_PATH;

        if (theme) {
          if (Array.isArray(compilation.fileDependencies) && !compilation.fileDependencies.includes(theme)) {
            compilation.fileDependencies.push(theme);
          } else if (compilation.fileDependencies instanceof Set && !compilation.fileDependencies.has(theme)) {
            compilation.fileDependencies.add(theme);
          }
        }

        callback();
      }; // Register the callback for...


      if (compiler.hooks) {
        // ... webpack 4, or...
        var plugin = {
          name: 'SharkrThemePlugin'
        };
        compiler.hooks.afterEmit.tapAsync(plugin, afterEmit);
      } else {
        // ... webpack 3.
        compiler.plugin('after-emit', afterEmit);
      }
    }
    /**
     * Replace a either less-loader or sass-loader with a custom loader which wraps it and extends
     * its functionality. In the case of less-loader, this enables live-reloading and customizing
     * antd's theme using an SCSS theme file. In the case of less-loader, this enables importing
     * all of antd's theme and color variables from the SCSS theme file.
     * antd.
     * @param {(string|Object)} config - A webpack loader config.
     * @return {Object} Loader config using the wrapped loader instead of the original.
     */

  }], [{
    key: "themify",
    value: function themify(config) {
      var _ref = typeof config === 'string' ? {
        loader: config
      } : config,
          loader = _ref.loader,
          _ref$options = _ref.options,
          options = _ref$options === void 0 ? {} : _ref$options;

      var overloadedLoader;

      switch (loader) {
        case 'sass-loader':
          overloadedLoader = require.resolve('./antdSassLoader.js');
          break;

        case 'less-loader':
          overloadedLoader = require.resolve('./antdLessLoader.js');
          break;

        default:
          overloadedLoader = loader;
          break;
      }

      return {
        loader: overloadedLoader,
        options: options
      };
    }
  }]);
  return SharkrThemePlugin;
}();

var _default = SharkrThemePlugin;
exports["default"] = _default;
module.exports = exports.default;