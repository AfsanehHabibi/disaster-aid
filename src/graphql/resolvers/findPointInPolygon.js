const {formModel} = require('../../models/form')
const {areaModel} = require('../../models/area')
const check = require('../../authorization/check')
const mongoose = require('mongoose');
const dot = require('dot-object');
const { FormITC, FormTC, InputITC } = require('../graphql')
let resolver = {
    name: 'findPointInPolygon',
    type: [AreaTC],
    args: { input: InputITC },
    resolve: async ({ source, args, context, info }) => {
        if (!check(context.user[process.env.ROLE_URL], 'read:area'))
            //if(!context.user.permissions.includes('read:area'))
            return new Error("you are not authorized for this!");
        return areaModel.find({
            geometry: {
                $geoIntersects:
                {
                    $geometry: args.point
                }
            }
        })
    }
}