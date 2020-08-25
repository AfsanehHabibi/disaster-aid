const { formModel } = require('../../models/form')
const { areaModel } = require('../../models/area')
const check = require('../../authorization/check')
const mongoose = require('mongoose');
const dot = require('dot-object');
const { FormITC, FormTC, InputITC } = require('../graphql')
let resolver = {
    name: 'findManyDes',
    //type: [FormTC.getFieldOTC('form_descriptor')],
    args: {},
    resolve: async ({ source, args, context, info }) => {
        console.debug(context.user[process.env.ROLE_URL])
        if (!check(context.user[process.env.ROLE_URL], 'read:form-descriptor'))
            return new Error({
                message: "you are not authorized for this!",
                status: 403
            });
        console.debug("lett")
        let res = await formModel.find({}, { form_descriptor: 1, _id: 0 });
        let formDesResult = []
        res.forEach(element => formDesResult.push(element.form_descriptor));
        return formDesResult;
    }
}
module.exports = resolver