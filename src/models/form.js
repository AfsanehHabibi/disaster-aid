let mongoose = require('mongoose')

let formInputSchema = new mongoose.Schema({
    fields: {
        date_fields: [{
            name: {
                type: String,
                required: true
            },
            value: {
                type: Date
            }
        }],
        location_fields: [{
            name: {
                type: String,
                required: true
            },
            value: {
                type: {
                    type: String, // Don't do `{ location: { type: String } }`
                    enum: ['Point'], // 'location.type' must be 'Point'
                    required: true
                },
                coordinates: {
                    type: [Number],
                    required: true
                }
            },
            areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }]
        }
        ],
        text_fields: [{
            name: {
                type: String,
                required: true
            },
            value: {
                type: String
            }
        }
        ],
        number_fields: [{
            name: {
                type: String,
                required: true
            },
            value: {
                type: Number
            }
        }
        ]
    }
})

let formSchema = new mongoose.Schema({
    form_descriptor: {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String
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
                value: String
            }]
        }]
    },
    filled_forms: [formInputSchema]
})


exports.formModel = mongoose.model('Form', formSchema)
exports.formInputModel = mongoose.model('FormInput',formInputSchema)