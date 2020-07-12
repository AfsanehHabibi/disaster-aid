let mongoose = require('mongoose')

let formInputSchema = new mongoose.Schema({
    fields: [{
        name: {
            type: String,
            required: true,
            unique: true,
        },
        value:String
    }]
})

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
                required: true
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
    filled_forms: [formInputSchema]
})


exports.formModel = mongoose.model('Form', formSchema)
