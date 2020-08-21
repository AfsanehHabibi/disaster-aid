require('dotenv').config()
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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
module.exports = checkJwt