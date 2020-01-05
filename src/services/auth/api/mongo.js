// mongo/index.js
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const log = require('./utils/log')

const MONGO_PATH = process.env.MONGO_PATH || 'mongodb://127.0.0.1:27017'
const MONGO_DB = process.env.MONGO_DB || 'starlight'
// const MONGO_COLLECTION = process.env.MONGO_COLLECTION || 'users'

const mongo = {
  db: null,
  collection: null,

  connect: () => {
    return MongoClient.connect(MONGO_PATH, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      try {
          mongo.db = client.db(MONGO_DB)
          log('[ AUTH ] - Connected to Mongo.')
        } catch(err) {
          log('[ AUTH ] - Error connecting to Mongo', err)
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
      log('[ AUTH ] - User found:', dbUser.username)
    }
    return dbUser
  },
  
  findDevice: async (id) => {
    mongo.collection = mongo.collection = mongo.db.collection('devices')
    let device = await mongo.collection.findOne({"device_id": id})
    if (device) {
      log('[ AUTH ] - Device found:', device.device_id)
    } else {
      log('[ AUTH ] - Device not found.')
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
      log('[ AUTH ] - Password authenticated.')
    } else {
      log('[ AUTH ] - Password not authenticated.')
    }
    return compare;
  },

  validateKey: async (key) => {
    mongo.collection = mongo.collection = mongo.db.collection('devices')
    let device = await mongo.collection.findOne({"key": key})
    if (device) {
      log('[ AUTH ] - Key ok:', device.key)
    } else {
      log('[ AUTH ] - Key invalid.')
    }
    return device
  },

}

module.exports = mongo;