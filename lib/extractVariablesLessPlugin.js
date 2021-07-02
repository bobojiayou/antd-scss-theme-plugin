"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * A less plugin that extracts variables computed during the compilation of a less file.
 * This is a modified version of the plugin available at [1].
 *
 * [1]: https://github.com/Craga89/less-plugin-variables-output
 */
var SELECTOR = '__VARIABLES__';

var PostProcessor = /*#__PURE__*/function () {
  function PostProcessor(less, callback) {
    (0, _classCallCheck2["default"])(this, PostProcessor);
    this.callback = callback;
  }

  (0, _createClass2["default"])(PostProcessor, [{
    key: "process",
    value: function process(css) {
      // Extract contents of fake selector from compiled CSS.
      var selectorStart = css.indexOf(SELECTOR);
      var selectorEnd = css.lastIndexOf('}');
      var selectorContents = css.slice(selectorStart + SELECTOR.length + 2, selectorEnd).trim(); // Parse the dummy selector's contents.

      var variables = selectorContents.split(';').reduce(function (accumulator, variable) {
        var next = Object.assign({}, accumulator);

        if (variable) {
          var _variable$split = variable.split(':'),
              _variable$split2 = (0, _toArray2["default"])(_variable$split),
              name = _variable$split2[0],
              value = _variable$split2.slice(1);

          next[name.trim()] = value.join(':').trim();
        }

        return next;
      }, {});
      this.callback(variables); // Remove slector from rendered less.

      return css.slice(0, selectorStart);
    }
  }]);
  return PostProcessor;
}();

var Visitor = /*#__PURE__*/function () {
  function Visitor(less) {
    (0, _classCallCheck2["default"])(this, Visitor);
    this.less = less;
    this.isPreEvalVisitor = true;
  }

  (0, _createClass2["default"])(Visitor, [{
    key: "run",
    value: function run(root) {
      // Create fake selector:
      // __VARIABLES__ {
      //   var-name: @var-name;
      // }
      var variables = root.variables();
      var rules = Object.keys(variables).map(function (variable) {
        return "".concat(variable.slice(1), ": ").concat(variable, ";");
      });
      var selector = "".concat(SELECTOR, "{").concat(rules.join('\n'), "}"); // Add the fake selector to less.

      this.less.parse(selector, {
        filename: SELECTOR
      }, function (_, mixinRoot) {
        root.rules.push(mixinRoot.rules[0]);
      });
    }
  }]);
  return Visitor;
}();

var ExtractVariablesPlugin = /*#__PURE__*/function () {
  function ExtractVariablesPlugin(options) {
    (0, _classCallCheck2["default"])(this, ExtractVariablesPlugin);
    this.minVersion = [2, 0, 0];

    if (!options.callback || typeof options.callback !== 'function') {
      throw new Error('Must supply a callback function that receives the parsed variables.');
    }

    this.callback = options.callback;
  }

  (0, _createClass2["default"])(ExtractVariablesPlugin, [{
    key: "install",
    value: function install(less, pluginManager) {
      pluginManager.addVisitor(new Visitor(less));
      pluginManager.addPostProcessor(new PostProcessor(less, this.callback));
    }
  }]);
  return ExtractVariablesPlugin;
}();

var _default = ExtractVariablesPlugin;
exports["default"] = _default;
module.exports = exports.default;