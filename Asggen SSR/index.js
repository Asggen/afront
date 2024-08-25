require("ignore-styles");

require("@babel/register")({
  ignore: [/(node_modules)/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
  extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
  plugins: [
    [
      "babel-plugin-css-modules-transform",
      {
        extensions: [".css", ".scss"],
        generateScopedName: "[name]__[local]___[hash:base64:5]",
      },
    ],
  ],
});

require("./ssr");