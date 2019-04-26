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
    }
};

module.exports = webpackConfig;