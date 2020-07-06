require('dotenv').config()
const express = require("express");
const winston = require("winston");
const bodyParser = require('body-parser');
const fs = require('fs');
const rfs = require('rotating-file-stream')
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
var express_graphql = require('express-graphql');
var graphql = require('graphql');
const { startDatabase } = require('./src/database/mongo');
const areaModel = require('./src/models/area').areaModel
const graphqlSchema = require('./src/schema/graphql')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
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
app.use(morgan('common', { stream: requestLogStream }));
app.set('port', process.env.PORT || 5000);
app.use(require("./api/test.js"));
// Create an express server and a GraphQL endpoint
app.use('/graphql', express_graphql({
  schema: graphqlSchema,
  //rootValue: root,
  graphiql: true
}));
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
startDatabase().then(async () => {
  logger.log({
    level: 'info',
    message: 'database connected'
  });
}
);
app.listen(app.get('port'));
logger.log({
  level: 'info',
  message: 'app listening in port ' + app.get('port')
});
exports.logger = logger;
