const mongoose = require('mongoose');
require('dotenv').config()

let database = null;

async function startDatabase(done) {
  const OPTIONS = 'retryWrites=true&w=majority'
  const uri = `mongodb+srv://${process.env.DATABASE_USER_PASSWORD}@${process.env.DATABASE_CLUESTER}-${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}?${OPTIONS}`
  const connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).then(res => done()
  )
    .catch(err => console.log(err))
  database = mongoose.connection;
  //database.on('error',console.error.bind(console,'MongoDB connection error'))
}
function stopDatabase(done) {
  if (database)
    mongoose.disconnect(() => {
      console.debug("database disconnected")
      //this function runs after the drop is completed
      //go ahead everything is done now.
      done();
    });
}
async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
  stopDatabase
};