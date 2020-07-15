let mongoose = require('mongoose')

let testServerSchema = new mongoose.Schema({
    enviroment_variable:{
        DATABASE_CLUESTER:String,
        DATABASE_USER_PASSWORD:String,
        DATABASE_URL:String,
        DATABASE_NAME:String
    },
    isDatabase_connectd:String,
    modelName:[String]
})

exports.testServerModel = mongoose.model('testServer',testServerSchema)