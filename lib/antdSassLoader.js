"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = antdSassLoader;
exports.overloadSassLoaderOptions = exports.themeImporter = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = require("loader-utils");

var _sassLoader = _interopRequireDefault(require("sass-loader"));

var _utils = require("sass-loader/dist/utils");

var _loaderUtils2 = require("./loaderUtils");

var _utils2 = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Utility returning a node-sass importer that provides access to all of antd's theme variables.
 * @param {string} themeScssPath - Path to SCSS file containing Ant Design theme variables.
 * @param {string} contents - The compiled content of the SCSS file at themeScssPath.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
var themeImporter = function themeImporter(themeScssPath, contents) {
  return function (url, previousResolve, done) {
    var request = (0, _loaderUtils.urlToRequest)(url);
    var pathsToTry = (0, _utils.getPossibleRequests)(request);

    var baseDirectory = _path["default"].dirname(previousResolve);

    for (var i = 0; i < pathsToTry.length; i += 1) {
      var potentialResolve = pathsToTry[i];

      if (_path["default"].resolve(baseDirectory, potentialResolve) === themeScssPath) {
        done({
          contents: contents
        });
        return;
      }
    }

    done();
  };
};
/**
 * Modify sass-loader's options so that all antd variables are imported from the SCSS theme file.
 * @param {Object} options - Options for sass-loader.
 * @return {Object} Options modified to includ a custom importer that handles the SCSS theme file.
 */


exports.themeImporter = themeImporter;

var overloadSassLoaderOptions = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var newOptions, scssThemePath, contents, extraImporter, importer;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            newOptions = _objectSpread({}, options);
            scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
            _context.next = 4;
            return (0, _utils2.compileThemeVariables)(scssThemePath);

          case 4:
            contents = _context.sent;
            extraImporter = themeImporter(scssThemePath, contents);

            if ('importer' in options) {
              if (Array.isArray(options.importer)) {
                importer = [].concat((0, _toConsumableArray2["default"])(options.importer), [extraImporter]);
              } else {
                importer = [options.importer, extraImporter];
              }
            } else {
              importer = extraImporter;
            }

            newOptions.importer = importer;
            console.log('newOptions', newOptions);
            return _context.abrupt("return", newOptions);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function overloadSassLoaderOptions(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * A wrapper around sass-loader which overloads loader options to include a custom importer handling
 * variable imports from the SCSS theme file, and registers the theme file as a watched dependency.
 * @param {...*} args - Arguments passed to sass-loader.
 * @return {undefined}
 */


exports.overloadSassLoaderOptions = overloadSassLoaderOptions;

function antdSassLoader() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var loaderContext = this;
  var callback = loaderContext.async();
  var options = (0, _loaderUtils.getOptions)(loaderContext);

  var newLoaderContext = _objectSpread({}, loaderContext);

  overloadSassLoaderOptions(options).then(function (newOptions) {
    delete newOptions.scssThemePath; // eslint-disable-line no-param-reassign

    newLoaderContext.query = {
      sassOptions: newOptions
    };
    var scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
    newLoaderContext.addDependency(scssThemePath);
    return _sassLoader["default"].call.apply(_sassLoader["default"], [newLoaderContext].concat(args));
  })["catch"](function (error) {
    // Remove unhelpful stack from error.
    error.stack = undefined; // eslint-disable-line no-param-reassign

    callback(error);
  });
}