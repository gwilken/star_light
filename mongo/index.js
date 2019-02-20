// mongo/index.js
const config = require('../config/index.js');
const MongoClient = require('mongodb').MongoClient;

const mongo = {
  db: null,
  collection: null,

  connect: () => {
      return MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`, { useNewUrlParser: true }, (err, client) => {
        try {
          mongo.db = client.db(config.db.name)
          mongo.collection = mongo.db.collection(config.db.collection)
          console.log('[ MONGO ] - Connected.')
        } catch(err) {
          console.log('[ MONGO ] - Error connecting to Mongo', err)
        }
      })
  },

  insert: (doc) => {
    return mongo.collection.insertOne(doc)
  },

  findUser: (email) => {
    return mongo.collection.findOne({"email": email})
  }
}

module.exports = mongo;