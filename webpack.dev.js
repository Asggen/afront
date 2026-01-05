const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const crypto = require("crypto");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "cheap-module-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dev"),
    },
    port: 9999,
    open: true,
    historyApiFallback: true,
  },
  output: {
    filename: "[name].bundle.js",
    path: `${__dirname}/dev`,
    publicPath: "/",
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
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]",
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
          filename: "static/media/[name][ext]",
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
    minimizer: [new TerserWebpackPlugin(), new CssMinimizerPlugin()],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].bundle.css",
    }),
    new htmlWebpackPlugin({
      title: "AFront",
      template: `${__dirname}/dev/index.html`,
      filename: "index.html",
      hash: true, // This will add the hash in the injected scripts
      templateParameters: (compilation) => {
        const hash = crypto.createHash("sha256");
        hash.update(compilation.hash);
        const sha256Hash = hash.digest("hex");
        return {
          htmlWebpackPlugin: {
            options: {
              title: "AFront",
              buildTag: `dev-${sha256Hash}`, // Set the build tag with the hash for dev
            },
          },
        };
      },
    }),
  ],
};
