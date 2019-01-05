const MiniCssExtractPlugin = require("mini-css-extract-plugin");


exports.devServer = ({ host, port } = {}) => ({

  devServer: {
    stats: "errors-only",
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
  },
});
// config works as of webpack v4.20.2
// see https://github.com/survivejs-demos/webpack-demo/blob/master/package.json
  // for more
exports.loadCSS = ({ include, exclude } = {}) => ({
  stats:"verbose",
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: [
          "style-loader",
          {
            loader:"css-loader",

          }
        ],
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use = [] }) => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: [MiniCssExtractPlugin.loader].concat(use),
        },
      ],
    },
    plugins: [plugin],
  };
};