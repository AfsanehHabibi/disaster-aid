require('dotenv').config()
const morgan = require('morgan');
var express_graphql = require('express-graphql');
const { startDatabase } = require('./src/database/mongo');
const {graphqlSchema} = require('./src/graphql/graphql');
const checkJwt = require('./src/authorization/jwtDecode')
const app = require('./src/app')
const {logger, requestLogStream} = require('./src/logger/winston')

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
    },
    customFormatErrorFn: (err) => ({ message: err.message, status: err.status })
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
