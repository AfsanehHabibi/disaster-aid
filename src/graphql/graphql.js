const mongoose = require('mongoose');
const {GraphQLString,GraphQLNonNull,GraphQLInputObjectType} = require('graphql')
/* import {
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql'; */
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer, toInputObjectType } = require('graphql-compose');
const dot = require('dot-object');
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
  resolve: async ({ source, args, context, info }) => {
    let mapPointToArea = undefined;
    let submittedForm = undefined;
    let input = JSON.parse(JSON.stringify(args.input));
    input._id = new mongoose.Types.ObjectId;
    console.log(mongoose.isValidObjectId(input._id))
    try {
      const responseArray = await Promise.all(
        input.fields.location_fields.map((element) => {
          console.log(element.value)
          point = element.value
          return areaModel.find({
            geometry: {
              $geoIntersects:
              {
                $geometry: point
              }
            }
          }, '_id')
        })

      );

      input.fields.location_fields.forEach((element, index) => {
      element.areas = responseArray[index]
      });
      submittedForm = await formModel.findOneAndUpdate(
        dot.dot(JSON.parse(JSON.stringify(args.filter)))
        , { $push: { filled_forms: input } })
      console.debug(submittedForm)
      let areasIdsFlat = responseArray.flat(1)
      mapPointToArea = await areaModel.updateMany(
        { _id: { $in: areasIdsFlat } },
        { $push: { 'relations.point_in_area': input._id } },
        { multi: true }
      )
    } catch (error) {
      console.error(error)
      return error
    }finally{
      if(mapPointToArea)
        return submittedForm;
      else 
        return null;
    }
  }
})

TestTC.addResolver({
  name: 'getServerStatus',
  type: TestTC,
  resolve: async ({ source, args, context, info }) => {
    console.log("kkkkkkkkkkkkkkkkkkkk")
    return {
      enviroment_variable: {
      },
      isDatabase_connectd: mongoose.connection.readyState,
      modelName: [InputITC.getType(), FormITC.getType()]
    }
  }
})

FormTC.addResolver({
  name: 'findOneLooseMatch',
  type: FormTC,
  args: { filter: FormITC },
  resolve: async ({ source, args, context, info }) => {
    return formModel.findOne(
      dot.dot(JSON.parse(JSON.stringify(args.filter))))
  }
})

AreaTC.addResolver({
  name: 'findPointInPolygon',
  type: [AreaTC],
  args: { input: InputITC },
  resolve: async ({ source, args, context, info }) => {
    return areaModel.find({
      geometry: {
        $geoIntersects:
        {
          $geometry:args.point
        }
      }
    })
  }
})
FormTC.addResolver({
  name: 'findManyLooseMatch',
  type: [FormTC],
  args: {  },
  resolve: async ({ source, args, context, info }) => {
    return formModel.find(
      dot.dot(JSON.parse(JSON.stringify(args.filter))))
  }
})

FormTC.addResolver({
  name: 'findSubById',
  type: FormTC.getFieldOTC('filled_forms'),
  args: {filter:DoubleId},
  resolve: async ({source,args,context,info}) => {
    console.log(args.filter)
    let input=JSON.parse(JSON.stringify(args.filter))
    let res=null;
    try {
      res=await formModel.findOne({'form_descriptor.id':args.filter.form_id}
    ,
    {'filled_forms':{
      $elemMatch:{
        '_id':args.filter.filled_id
      }
    }}
      )
    console.log("tha")
    } catch (error) {
      console.log(error)
    }
    console.log(res)
    return res.filled_forms[0];
  }
})
//predifined graphql-compose resolvers
schemaComposer.Query.addFields({
  formById: FormTC.getResolver('findById'),
  formByIds: FormTC.getResolver('findByIds'),
  formOne: FormTC.getResolver('findOne'),
  formOneLooseMatch: FormTC.getResolver('findOneLooseMatch'),
  formMany: FormTC.getResolver('findMany'),
  formManyLooseMatch: FormTC.getResolver('findManyLooseMatch'),
  formCount: FormTC.getResolver('count'),
  formConnection: FormTC.getResolver('connection'),
  formPagination: FormTC.getResolver('pagination'),
  testInfo: TestTC.getResolver('getServerStatus'),
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
  areaPagination: AreaTC.getResolver('pagination'),
  areaByPoint: AreaTC.getResolver('findPointInPolygon')
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