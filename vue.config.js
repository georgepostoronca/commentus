module.exports = {
  configureWebpack: {
    output: {
      filename: "js/widget.js"
    },
    optimization: {
      splitChunks: false
    }
  },
  css: {
    extract: {
      filename: "widget.css",
      chunkFilename: "widget.css"
    }
  },
  productionSourceMap: false,
  lintOnSave: false,
  // devServer: {
  //   host: "commentus.loc"
  // },
  publicPath: ""
};
