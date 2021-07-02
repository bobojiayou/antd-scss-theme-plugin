"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileThemeVariables = exports.loadScssThemeAsLess = exports.extractLessVariables = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _less = _interopRequireDefault(require("less"));

var _scssToJson = _interopRequireDefault(require("scss-to-json"));

var _extractVariablesLessPlugin = _interopRequireDefault(require("./extractVariablesLessPlugin"));

/**
 * Return values of compiled Less variables from a compilable entry point.
 * @param {string} lessEntryPath - Root Less file from which to extract variables.
 * @param {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
 *   during compilation.
 * @return {Object} Object of the form { 'variable': 'value' }.
 */
var extractLessVariables = function extractLessVariables(lessEntryPath) {
  var variableOverrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var lessEntry = _fs["default"].readFileSync(lessEntryPath, 'utf8');

  return new Promise( /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _less["default"].render(lessEntry, {
                filename: lessEntryPath,
                javascriptEnabled: true,
                modifyVars: variableOverrides,
                plugins: [new _extractVariablesLessPlugin["default"]({
                  callback: function callback(variables) {
                    return resolve(variables);
                  }
                })]
              });

            case 3:
              _context.next = 8;
              break;

            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](0);
              reject(_context.t0);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 5]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
/**
 * Read variables from a SCSS theme file into an object with Less-style variable names as keys.
 * @param {string} themeScssPath - Path to SCSS file containing only SCSS variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */


exports.extractLessVariables = extractLessVariables;

var loadScssThemeAsLess = function loadScssThemeAsLess(themeScssPath) {
  var rawTheme;

  try {
    rawTheme = (0, _scssToJson["default"])(themeScssPath);
  } catch (error) {
    throw new Error("Could not compile the SCSS theme file \"".concat(themeScssPath, "\" for the purpose of variable ") + 'extraction. This is likely because it contains a Sass error.');
  }

  var theme = {};
  Object.keys(rawTheme).forEach(function (sassVariableName) {
    var lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};
/**
 * Use SCSS theme file to seed a full set of Ant Design's theme variables returned in SCSS.
 * @param {string} themeScssPath - Path to SCSS file containing SCSS variables meaningful to Ant
 *   Design.
 * @return {string} A string representing an SCSS file containing all the theme and color
 *   variables used in Ant Design.
 */


exports.loadScssThemeAsLess = loadScssThemeAsLess;

var compileThemeVariables = function compileThemeVariables(themeScssPath) {
  var themeEntryPath = require.resolve('antd/lib/style/themes/default.less');

  var variableOverrides = themeScssPath ? loadScssThemeAsLess(themeScssPath) : {};
  return extractLessVariables(themeEntryPath, variableOverrides).then(function (variables) {
    return Object.entries(variables).map(function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
          name = _ref3[0],
          value = _ref3[1];

      return "$".concat(name, ": ").concat(value, ";\n");
    }).join('');
  });
};

exports.compileThemeVariables = compileThemeVariables;