var glob = require('glob');
var path = require('path');
var webpack = require('webpack');

var webpackConfig = {
    entry: glob.sync('./src/!(*.spec).js'),
    output: {
        path: __dirname + '/lib',
        filename: 'chainmaker.js',
        library: 'chainmaker',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        }
                    }
                ]
            }
        ]
    },
    // Add peer dependancy libraries here in the form of 'lodash/find'
    externals: []
};

module.exports = webpackConfig;