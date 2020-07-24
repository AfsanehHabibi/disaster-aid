const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    if(process.env.NODE_ENV=="development")
    app.use(createProxyMiddleware('/graphql', // replace with your endpoint
        { target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
     } // replace with your target

    ));
}