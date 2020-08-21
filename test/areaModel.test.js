let mongoose = require('mongoose')
const { startDatabase, stopDatabase } = require('../src/database/mongo');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
const { beforeEach } = require('mocha');
const continents = require('./testData/continent/continentsWithName.json');
const { assert } = require('chai');
const areaModel = require('../src/models/area').areaModel

describe('area model ', () => {
    before((done) => {
        startDatabase(() => {
            //this function runs after the drop is completed
            done(); //go ahead everything is done now.
        });
    })
    beforeEach((done) => {
        mongoose.connection.collections.areas.drop(() => {
            //this function runs after the drop is completed
            done(); //go ahead everything is done now.
        });
    })
    it('create many area', async function () {
        let areas = await areaModel.insertMany(continents.features);
        areas.should.have.length(8);
    })
    after((done) => {
        stopDatabase(done)
    })
}
);
