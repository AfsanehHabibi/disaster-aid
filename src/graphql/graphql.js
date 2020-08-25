const check = require('../authorization/check')
const mongoose = require('mongoose');
const { GraphQLString, GraphQLNonNull, GraphQLInputObjectType } = require('graphql')
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer, toInputObjectType } = require('graphql-compose');
const dot = require('dot-object');
const formPushToFilledResolver = require('./resolvers/formPushToFilled');
const findManyDesResolver = require('./resolvers/findManyDes');
const findManyLooseMatchResolver = require('./resolvers/findManyLooseMatch');
const findOneLooseMatchResolver = require('./resolvers/findOneLooseMatch');
const findOneLooseMatchDesResolver = require('./resolvers/findOneLooseMatchDes');
const findSubByIdResolver = require('./resolvers/findSubById')
//const resolver = require('./resolvers/formPushToFilled');
// STEP 1: DEFINE MONGOOSE SCHEMA AND MODEL
const areaModel = require('../models/area').areaModel
const formModel = require('../models/form').formModel
const testServerModel = require('../models/testServer').testServerModel
//const formInputModel = require('../models/form').formInputModel
// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const AreaTC = composeWithMongoose(areaModel, customizationOptions);
const FormTC = composeWithMongoose(formModel, customizationOptions);
const TestTC = composeWithMongoose(testServerModel, customizationOptions);
//const FormInputTC = composeWithMongoose(formInputModel, customizationOptions);

//Input models, structures for match user input
const DoubleId = new GraphQLInputObjectType({
  name: 'DoubleIdInput',
  description: 'Input for ids',
  fields: () => ({
    form_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    filled_id: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});

const InputITC = toInputObjectType(FormTC.getFieldOTC('filled_forms'));
const FormITC = toInputObjectType(FormTC);

// STEP 3: Add needed CRUD User operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing

//custom resolver for updating array
FormTC.addResolver({
  name: 'pushToArray',
  type: FormTC,
  args: { input: InputITC, filter: FormITC },
  resolve: formPushToFilledResolver.resolve
})
FormTC.addResolver({
  name: 'findOneLooseMatch',
  type: FormTC,
  args: { filter: FormITC },
  resolve: findOneLooseMatchResolver.resolve
})
FormTC.addResolver({
  name: 'findOneLooseMatchDes',
  type: FormTC.getFieldOTC('form_descriptor'),
  args: { filter: FormITC },
  resolve: findOneLooseMatchDesResolver.resolve
})

FormTC.addResolver({
  name: 'findManyLooseMatch',
  type: [FormTC],
  args: { filter: FormITC },
  resolve: findManyLooseMatchResolver.resolve
})

FormTC.addResolver({
  name: 'findSubById',
  type: FormTC.getFieldOTC('filled_forms'),
  args: { filter: DoubleId },
  resolve: findSubByIdResolver.resolve
})
FormTC.addResolver({
  name: 'findManyDes',
  type: [FormTC.getFieldOTC('form_descriptor')],
  args: {},
  resolve: findManyDesResolver.resolve
})
FormTC.getFieldTC('filled_forms').getFieldTC('fields').
  getFieldTC('location_fields').
  addRelation(
    'areasDoc', {
    resolver: AreaTC.getResolver('findByIds'), // NOT findById
    prepareArgs: {
      // source here is the `reaction` sub-doc
      _ids: (source) => source.areas,
    },
    projection: { areas: true },
  }
  );
//predifined graphql-compose resolvers
schemaComposer.Query.addFields({
  formById: FormTC.getResolver('findById'),
  formByIds: FormTC.getResolver('findByIds'),
  formOne: FormTC.getResolver('findOne'),
  formOneLooseMatch: FormTC.getResolver('findOneLooseMatch'),
  formDesOneLooseMatch: FormTC.getResolver('findOneLooseMatchDes'),
  formMany: FormTC.getResolver('findMany'),
  formDesMany: FormTC.getResolver('findManyDes'),
  formManyLooseMatch: FormTC.getResolver('findManyLooseMatch'),
  formCount: FormTC.getResolver('count'),
  formConnection: FormTC.getResolver('connection'),
  formPagination: FormTC.getResolver('pagination'),
  formFilledById: FormTC.getResolver('findSubById')
});

schemaComposer.Mutation.addFields({
  formPushToFilled: FormTC.getResolver('pushToArray'),
  formCreateOne: FormTC.getResolver('createOne'),
  formCreateMany: FormTC.getResolver('createMany'),
  formUpdateById: FormTC.getResolver('updateById'),
  formUpdateOne: FormTC.getResolver('updateOne'),
  formUpdateMany: FormTC.getResolver('updateMany'),
  formRemoveById: FormTC.getResolver('removeById'),
  formRemoveOne: FormTC.getResolver('removeOne'),
  formRemoveMany: FormTC.getResolver('removeMany'),
});

schemaComposer.Query.addFields({
  areaById: AreaTC.getResolver('findById'),
  areaByIds: AreaTC.getResolver('findByIds'),
  areaOne: AreaTC.getResolver('findOne'),
  areaMany: AreaTC.getResolver('findMany'),
  areaCount: AreaTC.getResolver('count'),
  areaConnection: AreaTC.getResolver('connection'),
  areaPagination: AreaTC.getResolver('pagination')
});

schemaComposer.Mutation.addFields({
  areaCreateOne: AreaTC.getResolver('createOne'),
  areaCreateMany: AreaTC.getResolver('createMany'),
  areaUpdateById: AreaTC.getResolver('updateById'),
  areaUpdateOne: AreaTC.getResolver('updateOne'),
  areaUpdateMany: AreaTC.getResolver('updateMany'),
  areaRemoveById: AreaTC.getResolver('removeById'),
  areaRemoveOne: AreaTC.getResolver('removeOne'),
  areaRemoveMany: AreaTC.getResolver('removeMany'),
});

const graphqlSchema = schemaComposer.buildSchema();
module.exports = {
  graphqlSchema,
  InputITC,
  FormITC,
  FormTC,
  DoubleId
}
