var webpack = require('webpack');
var path = require('path');

var webpackConfig = {
    entry: __dirname + '/src/chainmaker.js',
    output: {
        path: __dirname + '/lib',
        filename: 'chainmaker.js',
        library: 'chainmaker',
        libraryTarget: 'umd',
        umdNamedDefine: true
    }
};

module.exports = webpackConfig;