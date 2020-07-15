const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

module.exports = {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
  ],

  output: {
    path: path.resolve(__dirname, "src"),
    filename: "tinymce-for-contentful.js",
  },
};
