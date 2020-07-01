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

            }
        }]
    }
})

module.exports = mongoose.model('Form', formSchema)