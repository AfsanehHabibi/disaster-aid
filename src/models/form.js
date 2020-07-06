let mongoose = require('mongoose')

let formSchema = new mongoose.Schema({
    form_descriptor: {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true
        },
        fields: [{
            name: {
                type: String,
                required: true,
                unique: true,
            },
            title: {
                type: String
            },
            type: {
                type: String,
                enum: ["Text", "Number", "Location", "Date"]
            },
            required: {
                type: Boolean
            },
            options: [{
                label: {
                    type: String
                },
                value :String
            }]
        }]
    },
    filled_forms: {
        fields: [{
            name: {
                type: String,
                required: true,
                unique: true,
            },
            value:String
        }]
    }
})

exports.formModel = mongoose.model('Form', formSchema)