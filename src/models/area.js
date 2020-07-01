let mongoose = require('mongoose')

let areaSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    properties: {
        required: true,
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
        required: true,
        type: {
            type: String
        },
        coordinates: [{
            lat: Number,
            long: Number
        }]
    }
})

module.exports = mongoose.model('Area', areaSchema)