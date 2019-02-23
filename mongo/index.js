// mongo/index.js
const bcrypt = require('bcrypt');
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
        console.log('[ MONGO ] - Connected to Mongo.')
      } catch(err) {
        console.log('[ MONGO ] - Error connecting to Mongo', err)
      }
    })
  },

  insert: (doc) => {
    return mongo.collection.insertOne(doc)
  },

  findUser: async (user) => {
    let dbUser =  await mongo.collection.findOne({"username": user})
    console.log('[ MONGO ] - User found:', dbUser.username)
    return dbUser
  },

  createPassword: async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },

  validatePassword: async (password, userPassword) => {
    const compare = await bcrypt.compare(password, userPassword);
    console.log('[ MONGO ] - Password authenticated:', compare)
    return compare;
  }
}

module.exports = mongo;