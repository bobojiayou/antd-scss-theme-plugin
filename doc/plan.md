

## 方案

1. sass-loaer 的 additionalData 选项

在实际入口文件之前添加 Sass/SCSS 代码。在这种情况下，sass-loader 不会覆盖 data 选项，而只是添加条目的内容。

``` js

module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              additionalData: (content, loaderContext) => {
                // More information about available properties https://webpack.js.org/api/loaders/
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);

                if (relativePath === "styles/foo.scss") {
                  return "$value: 100px;" + content;
                }

                return "$value: 200px;" + content;
              },
            },
          },
        ],
      },
    ],
  },
};

```
所以我们要做的就是将我们自己的 主题 scss 文件， 转化为 变量字符串，我们现在需要这样的一个转换函数