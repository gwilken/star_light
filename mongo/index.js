// mongo/index.js
const bcrypt = require('bcrypt');
const config = require('../config/index.js');
const MongoClient = require('mongodb').MongoClient;
const log = require('../utils/log')

const mongo = {
  db: null,
  collection: null,

  connect: () => {
    return MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`, { useNewUrlParser: true }, (err, client) => {
      try {
        mongo.db = client.db(config.db.name)
        mongo.collection = mongo.db.collection(config.db.collection)
        log('[ MONGO ] - Connected to Mongo.')
      } catch(err) {
        log('[ MONGO ] - Error connecting to Mongo', err)
      }
    })
  },

  insert: (doc) => {
    return mongo.collection.insertOne(doc)
  },

  findUser: async (user) => {
    mongo.collection = mongo.collection = mongo.db.collection('users')

    let dbUser = await mongo.collection.findOne({"username": user})
    if (dbUser) {
      log('[ MONGO ] - User found:', dbUser.username)
    }
    return dbUser
  },
  
  findDevice: async (id) => {
    mongo.collection = mongo.collection = mongo.db.collection('devices')
    let device = await mongo.collection.findOne({"deviceId": id})
    if (device) {
      log('[ MONGO ] - Device found:', device.deviceId)
    } else {
      log('[ MONGO ] - Device not found.')
    }
    return device
  },

  createPassword: async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },

  validatePassword: async (password, userPassword) => {
    const compare = await bcrypt.compare(password, userPassword);
    
    if (compare) {
      log('[ MONGO ] - Password authenticated.')
    } else {
      log('[ MONGO ] - Password not authenticated.')
    }
    
    return compare;
  }
}

module.exports = mongo;