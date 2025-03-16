const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');


module.exports = merge(common, {

    mode: 'development',

    // so that error messages point correctly to the file involved
    devtool: "eval-source-map",
    
    // so that the server also restarts when a change is made to our html file
    devServer: {

      watchFiles: ["./src/template.html"],

    },

});