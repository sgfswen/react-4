const config = require('./bs-default');

// redirect all /api/** requests to http://localhost:8080/api/**
const httpProxyMiddleware = require('http-proxy-middleware');
const proxy = httpProxyMiddleware('/api', {
  target: 'http://localhost:8080',
  changeOrigin: true,
  logLevel: 'debug'
});

// fallback for react-routes
const historyApiFallback = require('connect-history-api-fallback');

const baseDir = './dist';
const startPath = '/react/';

module.exports = Object.assign({}, config, {
  server: {
    always: 'index.html',
    baseDir,
    middleware: [
      proxy,
      historyApiFallback({
        index: startPath
      })
    ],
  },
  files: [
    baseDir + '/index.html',
    baseDir + '/**/*.*',
  ],
  startPath,
  serveStatic: [
    baseDir,
  ],
});
