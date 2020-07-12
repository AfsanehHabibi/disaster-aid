const mongoose = require('mongoose');

let database = null;

async function startDatabase() {
    const options = 'retryWrites=true&w=majority'
    const uri = process.env.CONECTION_STRING+options
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify:false,
      useCreateIndex:true,
      useUnifiedTopology:true
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