const {formModel} = require('../../models/form')
const {areaModel} = require('../../models/area')
const check = require('../../authorization/check')
const mongoose = require('mongoose');
const dot = require('dot-object');
const { FormITC, FormTC, InputITC } = require('../graphql')
let resolver = {
    name: 'findManyLooseMatch',
    type: [FormTC],
    args: { filter: FormITC },
    resolve: async ({ source, args, context, info }) => {
        if (!check(context.user[process.env.ROLE_URL], 'read:form-filled') ||
            !check(context.user[process.env.ROLE_URL], 'read:form-descriptor'))
            return new Error({
                message: "you are not authorized for this!",
                status: 403
            });
        return formModel.find(
            dot.dot(JSON.parse(JSON.stringify(args.filter))))
    }
}
module.exports = resolver