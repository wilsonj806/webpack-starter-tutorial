const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const parts = require("./webpack.parts");
const path = require('path');

const commonConfig = merge([
  {
    entry: { main: "./src/index.js" },
    output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js"
  },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo",
      }),
    ],
  },

]);

const productionConfig = merge([
  parts.extractCSS({use:'css-loader'}),
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
]);

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};