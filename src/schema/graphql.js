const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer, toInputObjectType } = require('graphql-compose');
const dot = require('dot-object');
// STEP 1: DEFINE MONGOOSE SCHEMA AND MODEL
const areaModel = require('../models/area').areaModel
const formModel = require('../models/form').formModel

// STEP 2: CONVERT MONGOOSE MODEL TO GraphQL PIECES
const customizationOptions = {}; // left it empty for simplicity, described below
const AreaTC = composeWithMongoose(areaModel, customizationOptions);
const FormTC = composeWithMongoose(formModel, customizationOptions);

//Input models, structures for match user input
const InputITC = toInputObjectType(FormTC.getFieldOTC('filled_forms'));
const FormITC = toInputObjectType(FormTC);

// STEP 3: Add needed CRUD User operations to the GraphQL Schema
// via graphql-compose it will be much much easier, with less typing

//custom resolver for updating array
FormTC.addResolver({
  name: 'pushToArray',
  type: FormTC,
  args: { input: InputITC, filter: FormITC},
  resolve: async ({ source, args, context, info }) => {   
      return formModel.findOneAndUpdate(
        dot.dot(JSON.parse(JSON.stringify(args.filter)))
        ,{$push: {filled_forms: JSON.parse(JSON.stringify(args.input))}})
        }
})
//predifined graphql-compose resolvers
schemaComposer.Query.addFields({
  formById: FormTC.getResolver('findById'),
  formByIds: FormTC.getResolver('findByIds'),
  formOne: FormTC.getResolver('findOne'),
  formMany: FormTC.getResolver('findMany'),
  formCount: FormTC.getResolver('count'),
  formConnection: FormTC.getResolver('connection'),
  formPagination: FormTC.getResolver('pagination'),
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
  areaPagination: AreaTC.getResolver('pagination'),
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
module.exports = graphqlSchema;