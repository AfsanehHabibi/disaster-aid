const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(createProxyMiddleware('/graphql', // replace with your endpoint
        { target: 'http://localhost:5000',
        changeOrigin: true,
     } // replace with your target

    ));
}