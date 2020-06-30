const mongoose = require('mongoose');

let database = null;

async function startDatabase() {
    const uri = process.env.CONECTION_STRING
    const connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });;
    database = mongoose.connection;
    database.on('error',console.error.bind(console,'MongoDB connection error'))
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
  }
  
  module.exports = {
    getDatabase,
    startDatabase,
  };