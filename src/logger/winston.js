const winston = require("winston");
const rfs = require('rotating-file-stream')
const path = require('path');

var requestLogStream = rfs.createStream('requests.log',
    {
        interval: '1d', // rotate daily  
        path: path.join(__dirname, 'log')
    })
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, 'log/server.log') })
    ]
});

module.exports = {
    logger,
    requestLogStream
};
