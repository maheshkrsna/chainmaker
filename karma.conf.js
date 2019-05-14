module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: ['src/*.js'],
        reporters: ['progress'],
        // karma web server port
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        // Karma captures browsers, runs the tests and exits
        // singleRun: false,
        concurrency: Infinity,
        preprocessors: {
            'src/*.js': ['babel', 'webpack']
        },
        babelPreprocessor: {
            options: {
                presets: ['@babel/preset-env'],
                plugins: [
                    [
                        '@babel/plugin-proposal-class-properties',
                        { loose: true }
                    ]
                ]
            }
        },
        webpack: {
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: ['@babel/preset-env'],
                                    plugins: [
                                        [
                                            '@babel/plugin-proposal-class-properties',
                                            { loose: true }
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
