module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    reporters: ['karmaHTML', 'progress'],
    client: {
      karmaHTML: {
        auto: false,
        source: [{ src: '/test/child.html', tag: 'child' }]
      }
    },
    files: [
      { pattern: 'src/**/*.spec.ts', watched: false },
      { pattern: 'test/*.html', served: true },
      {
        pattern: 'dist/bellhop.js',
        watched: true,
        served: true,
        included: false
      }
    ],
    preprocessors: {
      'src/**/*.spec.ts': ['webpack']
    },
    webpack: {
      mode: 'development',
      resolve: { extensions: ['.ts', '.js'] },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: { loader: 'ts-loader', options: { configFile: 'tsconfig.test.json' } },
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: { stats: 'errors-only' },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: true,
    concurrency: Infinity,
    proxies: {
      '/html/': '/base/test/',
      '/js/': '/base/dist/'
    }
  });
};
