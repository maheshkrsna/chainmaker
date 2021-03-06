let glob = require('glob');

let webpackConfig = {
    entry: './src/chainmaker.js',
    output: {
        path: __dirname + '/lib',
        filename: 'chainmaker.js',
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
                            ],
                            plugins: [
                                ['@babel/plugin-proposal-class-properties', { 'loose': true }]
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
