const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const crypto = require("crypto");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "static/js/[name]-[contenthash].js",
    path: path.resolve(__dirname, "build-prod"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, "./.babelrc"),
          },
        },
      },
      {
        test: /\.module\.css$/,
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
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "static/fonts/[name][ext]",
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "AFront",
      template: "./dev/index.html",
      buildTag: `prod-[contenthash]`,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      templateParameters: (compilation) => {
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
        { from: "dev/favicon.ico", to: "favicon.ico" },
        { from: "dev/logo192.png", to: "logo192.png" },
        { from: "dev/logo512.png", to: "logo512.png" },
        { from: "dev/manifest.json", to: "manifest.json" },
        { from: "dev/style.css", to: "style.css" },
        { from: "dev/robots.txt", to: "robots.txt" },
      ],
    }),
  ],
  performance: {
    hints: "warning",
    maxEntrypointSize: 400000,
    maxAssetSize: 400000,
  },
};
