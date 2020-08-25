const {formModel} = require('../../models/form')
const {areaModel} = require('../../models/area')
const check = require('../../authorization/check')
const mongoose = require('mongoose');
const dot = require('dot-object');
const { FormITC, FormTC, InputITC, DoubleId } = require('../graphql')
let resolver = {
    name: 'findSubById',
    //type: FormTC.getFieldOTC('filled_forms'),
    args: { filter: DoubleId },
    resolve: async ({ source, args, context, info }) => {
        //if(!context.user.permissions.includes('read:form-filled') ||
        // !context.user.permissions.includes('read:form-descriptor'))
        if (!check(context.user[process.env.ROLE_URL], 'read:form-filled') ||
            !check(context.user[process.env.ROLE_URL], 'read:form-descriptor'))
            return new Error({
                message: "you are not authorized for this!",
                status: 403
            });
        console.log(args.filter)
        let input = JSON.parse(JSON.stringify(args.filter))
        let res = null;
        try {
            res = await formModel.findOne({ 'form_descriptor.id': args.filter.form_id }
                ,
                {
                    'filled_forms': {
                        $elemMatch: {
                            '_id': args.filter.filled_id
                        }
                    }
                }
            )
            console.log("tha")
        } catch (error) {
            console.log(error)
        }
        console.log(res)
        return res.filled_forms[0];
    }
}
module.exports = resolver