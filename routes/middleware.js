const mongo = require('../mongo');
const token = require('../auth/token');
const log = require('../utils/log');
const redis = require('redis')
const RedisClient = require('../redis/RedisClient.js')
const config = require('../config')


const addDevice = async (req, res, next) => { 
  let { deviceId, key } = req.body;
  let newDevice = { deviceId, key: await mongo.createPassword(key) }

  mongo.collection = mongo.collection = mongo.db.collection('devices')

  let insertRes = await mongo.insert(newDevice)

  if (insertRes.result.ok) {
    log('[ ROUTES ] - Device registerd:', newDevice.deviceId)
    res.status(200).json({"status": "registered"})
  } else {
    next('[ EXPRESS ] - Error registering device:', username)
  }
}


const addUser = async (req, res, next) => { 
  let { newuser, newpass, newgroup } = req.body;
  
  let user = { 
    username: newuser, 
    password: await mongo.createPassword(newpass),
    group: newgroup, 
  }

  mongo.collection = mongo.collection = mongo.db.collection('users')

  let insertRes = await mongo.insert(user)

  if (insertRes.result.ok) {
    log('[ ROUTES ] - User registerd:', newuser)
    res.status(200).json({"status": "registered"})
  } else {
    next('[ EXPRESS ] - Error registering user:', newuser)
  }
}


const checkForUserAndPass = (req, res, next) => {
  if (!req.body.username) {
    res.status(422).json({
      error: 'username is required.',
    })
    next('[ EXPRESS ] - Error, username is required.')
  }

  if (!req.body.password) {
    res.status(422).json({
      error: 'password is required.',
    })
    next('[ EXPRESS ] - Error, password is required')
  }
  next()
}


const validateAdminUser = async (req, res, next) => {
  let dbUser = await mongo.findUser(req.body.username)

  const failValidation = (err) => {
    res.status(403).json({
      error: 'Validation failed.',
    })
    next(`[ EXPRESS ] - Error: Validation failed: ${err}`)
  }

  if (dbUser) {
    let isValid = await mongo.validatePassword(req.body.password, dbUser.password) 
    let isAdmin = dbUser.group === 'admin' ? true : false

    if (isValid && isAdmin) {
      next()
    } else {
      failValidation('Admin authentication valid.')
    }
  } else {
    failValidation('User not found.')
  }
}


const validateUser = async (req, res, next) => {
  let dbUser = await mongo.findUser(req.body.username)

  const failValidation = (err) => {
    res.status(403).json({
      error: 'Validation failed.',
    })
    next(`[ EXPRESS ] - Error: Validation failed: ${err}`)
  }

  if (dbUser) {
    let isValid = await mongo.validatePassword(req.body.password, dbUser.password) 

    if (isValid) {
      next()
    } else {
      failValidation('Invaild password.')
    }
  } else {
    failValidation('User not found.')
  }
}


const validateDevice = async (req, res, next) => {
  let device = await mongo.findDevice(req.body.deviceId)
  
  const failValidation = (err) => {
    res.status(403).json({
      error: 'Device validation failed.',
    })
    next(`[ EXPRESS ] - Error: Device validation failed: ${err}`)
  }

  if (device) {
    let isValid = await mongo.validatePassword(req.body.key, device.key) 

    if (isValid) {
      next()
    } else {
      failValidation('Invaild key.')
    }
  } else {
    failValidation('Device not found.')
  }
}


const validateToken = async (req, res, next) => {
  try {  
    let verifiedToken = await token.verify(req.body.token)
    if (!verifiedToken) {
      res.sendStatus(403)
    } else {
      next()
    }
  }

  catch (err) {
    res.sendStatus(403)
  }
}


const sendToken = async (req, res, next) => {
  let host = req.get('host')
  let { username } = req.body;
  const newToken = await token.generateJWT(username, host)
  res.json({ "token" : newToken })  
}


const parseDeviceData = (req, res, next) => {
  let redisClient = redis.createClient(config.redis.port, config.redis.host)
  
  try {
    let { data } = req.body || {}

    Object.keys(data).forEach(key => {
      Object.entries(data[key]).forEach(entry => {
        
        let [ groupKey, val ] = entry

        if (groupKey === 'redis') {
          let { hashkey, set } = data[key]['redis']

          if (hashkey) {
            let { redis, ...objNoRedis } = data[key]
            redisClient.hmset(hashkey, objNoRedis)
          }

          if (set) {
            redisClient.zadd(set, data[key].timestamp, hashkey)
          }
        }
      })
    })
    log('[ EXPRESS ] - Parsed device data, pushed to Redis.')
    res.sendStatus(200)
  }

  catch (err) {
    redisClient.close()
    next('[ EXPRESS ] - Error parsing device data:', err)
  }
}


const getHashsFromSet = async (req, res, next) => {
  let {set, start, end} = req.body
  let redisClient = new RedisClient()
  let docs = await redisClient.getHashsFromSet(set, start, end)
  redisClient.quit()
  res.json(docs)
}


const getHashsFromSetByScore = async (req, res, next) => {
  let {set, start, end} = req.body
  let redisClient = new RedisClient()
  let docs = await redisClient.getHashsFromSetByScore(set, start, end)
  redisClient.quit()
  res.json(docs)
}


module.exports = { 
  addDevice, 
  addUser, 
  checkForUserAndPass,
  validateAdminUser,
  validateUser,
  validateDevice,
  sendToken,
  parseDeviceData,
  validateToken,
  getHashsFromSet,
  getHashsFromSetByScore
}