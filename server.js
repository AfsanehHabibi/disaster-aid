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
const graphqlSchema = require('./src/graphql/graphql')
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
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


const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.JWT_ISSUER}.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'DisasterAidApi',
  issuer: `${process.env.JWT_ISSUER}`,
  algorithms: ['RS256']
});

app.use(morgan(':req[header] :res[header] :method :url :response-time', { stream: requestLogStream }));


app.set('port', process.env.PORT || 5000);
// Create an express server and a GraphQL endpoint
//app.use('/graphql',  express_graphql(
app.use('/graphql', checkJwt, express_graphql(

  req => ({
    schema:graphqlSchema,
    graphiql: true,
    context: {
      user: req.user
    }
  }
  )));
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
startDatabase(async () => {
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
