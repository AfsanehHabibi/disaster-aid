let mongoose = require('mongoose')

let areaSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    properties: {
        stroke: {
            type: String
        },
        strokeWidth: {
            type: String
        },
        strokeOpacity: {
            type: Number
        },
        fill: {
            type: String
        },
        fillOpacity: {
            type: Number
        },
        name: {
            type: String,
            required: true
        }
    },
    geometry: {
        type: {
            type: String,
            required: true
        },
        coordinates:
        {
            type: [[[Number]]], // Array of arrays of arrays of numbers
            required: true
        }
    },
    relations:{
        point_in_area:[{ type: mongoose.Schema.Types.ObjectId, ref: 'FormFilled_forms' }]
    }
})

exports.areaSchema = areaSchema
exports.areaModel = mongoose.model('Area', areaSchema)

