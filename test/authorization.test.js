const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:4000`;
const port = 4000;
const request = require('supertest')(url);
const { GracefulShutdownManager } = require('@moebius/http-graceful-shutdown');
const express_graphql = require('express-graphql');
const { startDatabase, stopDatabase } = require('../src/database/mongo')
const app = require('../src/app')
const {graphqlSchema} = require('../src/graphql/graphql')
const authDataValid = require('./testData/jwt/valid.json')
let shutdownManager
describe('GraphQL', () => {
    before((done) => {
        app.use('/graphql', express_graphql(
            req => ({
                schema: graphqlSchema,
                graphiql: true,
                context: {
                    user: authDataValid.admin
                },
                formatError: (err) => ({ message: err.message, status: err.status }),
            }
            )));
        let server = app.listen(port);
        shutdownManager = new GracefulShutdownManager(server);
        startDatabase(() => {
            console.debug("database connected")
            //this function runs after the drop is completed
            done(); //go ahead everything is done now.
        });
    })
    it('allow admin to access', (done) => {
        request.post('/graphql')
            .send({
                query: ' {formDesMany{id title}}' })
            .expect(200)
            .end((err, res) => {
                // res will contain array with one user
                if (err) return done(err);
                done();
            })
    })
    after((done) => {
        shutdownManager.terminate(() => {
            console.log('Server is gracefully terminated');
            stopDatabase(() => {
                //this function runs after the drop is completed
                done(); //go ahead everything is done now.
            });
        });
    })
});