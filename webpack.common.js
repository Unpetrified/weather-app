// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

  entry: "./src/index.js",

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  
  plugins: [
    // for our html file
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      // for our css files N/B you have to import them into a js file
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // for any image in our html file
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // for any image in our js files
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      
    ],
  },
};
