const check = require('../authorization/check')
const mongoose = require('mongoose');
const {GraphQLString,GraphQLNonNull,GraphQLInputObjectType} = require('graphql')
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
    if(!check(context.user[process.env.ROLE_URL],'create:form-filled'))
    //if(!context.user.permissions.includes('create:form-filled'))
      return new Error("you are not authorized for this!");
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
    console.log(context.user)
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
    if(!check(context.user[process.env.ROLE_URL],'read:form-filled') ||
    !check(context.user[process.env.ROLE_URL],'read:form-descriptor'))
    //if(!context.user.permissions.includes('read:form-filled') ||
    // !context.user.permissions.includes('read:form-descriptor'))
      return new Error("you are not authorized for this!");
    return formModel.findOne(
      dot.dot(JSON.parse(JSON.stringify(args.filter))))
  }
})
FormTC.addResolver({
  name: 'findOneLooseMatchDes',
  type: FormTC.getFieldOTC('form_descriptor'),
  args: { filter: FormITC },
  resolve: async ({ source, args, context, info }) => {
    if(!check(context.user[process.env.ROLE_URL],'read:form-descriptor'))
    //if(!context.user.permissions.includes('read:form-descriptor'))
      return new Error("you are not authorized for this!");
    let res= await formModel.findOne(
      dot.dot(JSON.parse(JSON.stringify(args.filter))),{form_descriptor:1});
      let formDes=res.form_descriptor;
      console.debug(formDes)
    return formDes;
  }
})
AreaTC.addResolver({
  name: 'findPointInPolygon',
  type: [AreaTC],
  args: { input: InputITC },
  resolve: async ({ source, args, context, info }) => {
    if(!check(context.user[process.env.ROLE_URL],'read:area'))
    //if(!context.user.permissions.includes('read:area'))
      return new Error("you are not authorized for this!");
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
  args: { filter:FormITC},
  resolve: async ({ source, args, context, info }) => {
    //if(!context.user.permissions.includes('read:form-filled') ||
    // !context.user.permissions.includes('read:form-descriptor'))
    if(!check(context.user[process.env.ROLE_URL],'read:form-filled') ||
    !check(context.user[process.env.ROLE_URL],'read:form-descriptor'))
      return new Error("you are not authorized for this!");
    return formModel.find(
      dot.dot(JSON.parse(JSON.stringify(args.filter))))
  }
})

FormTC.addResolver({
  name: 'findSubById',
  type: FormTC.getFieldOTC('filled_forms'),
  args: {filter:DoubleId},
  resolve: async ({source,args,context,info}) => {
    //if(!context.user.permissions.includes('read:form-filled') ||
    // !context.user.permissions.includes('read:form-descriptor'))
    if(!check(context.user[process.env.ROLE_URL],'read:form-filled') ||
    !check(context.user[process.env.ROLE_URL],'read:form-descriptor'))
      return new Error("you are not authorized for this!")
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
FormTC.addResolver({
  name: 'findManyDes',
  type: [FormTC.getFieldOTC('form_descriptor')],
  args: { },
  resolve: async ({ source, args, context, info }) => {
    console.debug(context.user[process.env.ROLE_URL])
    //if(!context.user.permissions.includes('read:form-descriptor'))
    if(!check(context.user[process.env.ROLE_URL],'read:form-descriptor'))
      return new Error("you are not authorized for this!");
    let res= await formModel.find({},{form_descriptor:1,_id:0});
    let formDesResult=[]
    res.forEach(element => formDesResult.push(element.form_descriptor));
    return formDesResult;
  }
})
 FormTC.getFieldTC('filled_forms').getFieldTC('fields').
getFieldTC('location_fields').
addRelation(
  'areasDoc',{
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