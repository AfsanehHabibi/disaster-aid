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
            [{
                lat: Number,
                long: Number
            }
            ]
    }
})

exports.areaSchema = areaSchema
exports.areaModel = mongoose.model('Area', areaSchema)

