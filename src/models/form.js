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
                type: String
            },
            required: {
                type: Boolean
            },
            options: [{
                label: {
                    type: String
                },
                value: {
                    type: String,
                    lat: Number,
                    long: Number
                }
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
            value: {
                type: String,
                lat: Number,
                long: Number
            }
        }]
    }
})

module.exports = mongoose.model('Form', formSchema)