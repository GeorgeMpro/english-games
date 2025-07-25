/* eslint-env node */
/* jshint node: true */
// @ts-nocheck
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = process.env.CHROME_BIN ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
    : '/usr/bin/google-chrome');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/untitled'),
      subdir: '.',
      reporters: [
        {type: 'html'},
        {type: 'text-summary'}
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    browserConsoleLogOptions: {
      level: 'error'  // suppress everything below error
    },
    restartOnFileChange: true,
    // updated timeout
    captureTimeout: 300000,
    browserDisconnectTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTolerance: 3,
  });
};
