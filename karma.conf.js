module.exports = function(config) {
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
      { pattern: 'src/**/*.spec.js', watched: false },
      { pattern: 'test/*.html', served: true },
      {
        pattern: 'src/**/!(*.spec).js',
        watched: true,
        served: true,
        included: false
      }
    ],
    preprocessors: {
      'src/**/*.spec.js': ['webpack']
    },
    webpackMiddleware: { stats: 'errors-only' },
    babelPreprocessor: {
      options: {
        presets: ['env'],
        sourceMap: 'inline'
      }
    },
    port: 9876, // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless', 'Chrome'],
    autoWatch: true,
    concurrency: Infinity,
    proxies: {
      '/html/': '/base/test/',
      '/js/': '/base/src/'
    }
  });
};
