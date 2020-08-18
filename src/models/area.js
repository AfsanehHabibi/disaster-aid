let mongoose = require('mongoose')
let geoJsonValidator = require('../validator/geoJsonValidator').validateGeoJson
function geometryValidator(v) {
    return geoJsonValidator(this.geometry);
}
let areaSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["Feature"]
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
            enum: ["Polygon", "MultiPolygon"],
            required: true
        },
        coordinates:
        {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            validate: [geometryValidator, 'geometery should be a valid geojson object'] 
        },
        
    },
    relations: {
        point_in_area: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormFilled_forms' }]
    }
})
 
exports.areaSchema = areaSchema
exports.areaModel = mongoose.model('Area', areaSchema)

