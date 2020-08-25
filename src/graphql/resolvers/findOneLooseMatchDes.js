const {formModel} = require('../../models/form')
const {areaModel} = require('../../models/area')
const check = require('../../authorization/check')
const { schemaComposer, toInputObjectType } = require('graphql-compose');
const mongoose = require('mongoose');
const dot = require('dot-object');
const { FormITC, FormTC, InputITC } = require('../graphql')
let resolver = {
    name: 'findOneLooseMatchDes',
    //type: FormTC.getFieldOTC('form_descriptor'),
    args: { filter: FormITC },
    resolve: async ({ source, args, context, info }) => {
        if (!check(context.user[process.env.ROLE_URL], 'read:form-descriptor'))
            return new Error({
                message: "you are not authorized for this!",
                status: 403
            });
        let res = await formModel.findOne(
            dot.dot(JSON.parse(JSON.stringify(args.filter))), { form_descriptor: 1 });
        let formDes = res.form_descriptor;
        console.debug(formDes)
        return formDes;
    }
}
module.exports = resolver