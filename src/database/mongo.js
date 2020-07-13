const mongoose = require('mongoose');

let database = null;

async function startDatabase() {
    const OPTIONS = 'retryWrites=true&w=majority'
    const uri = `mongodb+srv://${process.env.DATABASE_USER_PASSWORD}@${process.env.DATABASE_CLUESTER}-${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?${OPTIONS}`
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useFindAndModify:false,
      useCreateIndex:true,
      useUnifiedTopology:true
    }).then(res => console.log("Connected to DB"))
    .catch(err => console.log(err))
    database = mongoose.connection;
    //database.on('error',console.error.bind(console,'MongoDB connection error'))
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
  }
  
  module.exports = {
    getDatabase,
    startDatabase,
  };