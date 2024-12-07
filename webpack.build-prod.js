const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const crypto = require("crypto");

module.exports = {
  mode: "production",
  entry: "./src/Static/indexStatic.js",
  output: {
    filename: "static/js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "build-prod-static"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              configFile: path.resolve(__dirname, "./.babelrc"),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "asggen-[hash:base64:7]",
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[contenthash][ext]",
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name][ext]",
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false, // Remove all comments
          },
        },
        extractComments: false, // Do not extract comments to a separate file
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      title: "AFront",
      template: "./dev/index.html",
      buildTag: `prod-[contenthash]`,
      hash: true,
      templateParameters: (compilation, options) => {
        const hash = crypto.createHash("sha1");
        hash.update(compilation.hash);
        const sha1Hash = hash.digest("hex");
        return {
          htmlWebpackPlugin: {
            options: {
              title: "AFront",
              buildTag: `prod-${sha1Hash}`,
            },
          },
        };
      },
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name]-[contenthash].css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "dev/favicon.ico", to: "favicon.ico" }, // Copy favicon
        { from: "dev/logo192.png", to: "logo192.png" }, // Copy logo192
        { from: "dev/logo512.png", to: "logo512.png" }, // Copy logo512
        { from: "dev/manifest.json", to: "manifest.json" }, // Copy manifest
        { from: "dev/style.css", to: "style.css" },
        { from: "dev/robots.txt", to: "robots.txt" },
      ],
    }),
  ],
};
