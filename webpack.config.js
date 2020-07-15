const path = require("path");

module.exports = {
  watch: true,
  devtool: "source-map",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
  },
};
