module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: ['src/*.spec.js'],
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
            'src/*.spec.js': ['webpack']
        },
        webpack: {
            module: {
                rules: [
                    {
                        test: /\.spec.js$/,
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
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
