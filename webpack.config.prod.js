const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "production",
  plugins: [new Dotenv()],

  output: {
    path: path.resolve(__dirname, "src"),
    filename: "tinymce-for-contentful.js",
  },
};
