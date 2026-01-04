const fs = require("fs");
const path = require("path");
const BannerWebpackPlugin = require("banner-webpack-after-content");

function findMainHashedFile(directory) {
  const files = fs.readdirSync(directory);
  const regex = /^main-([a-f0-9]{8,})\.js$/;
  for (const file of files) {
    const match = file.match(regex);
    if (match) {
      return {
        filename: file,
        hash: match[1], 
      };
    }
  }
  return null;
}

const jsDirectory = path.join(__dirname, "build-prod/static/js");
const mainHashedJsFile = findMainHashedFile(jsDirectory);

if (!mainHashedJsFile) {
  throw new Error("Main JS file not found");
}

const { filename, hash } = mainHashedJsFile;

module.exports = {
  mode: "production",
  entry: {
    "main": [path.join(jsDirectory, filename)],
  },
  output: {
    filename: `static/js/[name]-${hash}.js`,
    path: path.resolve(__dirname, "build-prod"),
  },
  plugins: [
    new BannerWebpackPlugin({
      chunks: {
        "main": {
          afterContent: `setTimeout(console.log.bind(console,"%cStop!",'color:red;font-size:3rem;font-famaily:-apple-system;font-weight:500;'),0);`,
        },
      },
    }),
  ],
};