const { formModel } = require('../../models/form')
const { areaModel } = require('../../models/area')
const check = require('../../authorization/check')
const mongoose = require('mongoose');
const dot = require('dot-object');
const { FormITC, FormTC, InputITC } = require('../graphql')
let resolver = {
  name: 'pushToArray',
  type: FormTC,
  args: { input: InputITC, filter: FormITC },
  resolve: async ({ source, args, context, info }) => {
    console.debug(context.user)
    if (!check(context.user[process.env.ROLE_URL], 'create:form-filled'))
      return new Error({
        message: "you are not authorized for this!",
        status: 403
      });
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
    } finally {
      if (mapPointToArea)
        return submittedForm;
      else
        return null;
    }
  }
}
module.exports = resolver