const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      popup: "./src/popup/Popup.jsx",
      options: "./src/options/Options.jsx",
      background: "./src/background/background.js",
      contentScript: "./src/content/contentScript.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: (pathData) => {
        switch (pathData.chunk.name) {
          case "contentScript":
            return "content/contentScript.js";
          case "background":
            return "background/background.js";
          case "popup":
            return "popup/popup.js";
          case "options":
            return "options/options.js";
          default:
            return "[name]/[name].js";
        }
      },
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/manifest.json",
            to: "manifest.json",
          },
          {
            from: "public/icons",
            to: "icons",
          },
          {
            from: "src/styles",
            to: "styles",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: "./src/popup/popup.html",
        filename: "popup/popup.html",
        chunks: ["popup"],
      }),
      new HtmlWebpackPlugin({
        template: "./src/options/options.html",
        filename: "options/options.html",
        chunks: ["options"],
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "[name]/[name].css",
            }),
          ]
        : []),
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    devtool: isProduction ? false : "source-map",
  };
};
