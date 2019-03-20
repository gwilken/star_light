const mongo = require('../mongo');
const token = require('../auth/token');
const log = require('../utils/log');

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
  let { username, password } = req.body;
  let newUser = { username, password: await mongo.createPassword(password) }
  mongo.collection = mongo.collection = mongo.db.collection('users')

  let insertRes = await mongo.insert(newUser)

  if (insertRes.result.ok) {
    log('[ ROUTES ] - User registerd:', username)
    res.status(200).json({"status": "registered"})
  } else {
    next('[ EXPRESS ] - Error registering user:', username)
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

const sendToken = async (req, res, next) => {
  let host = req.get('host')
  let { username } = req.body;
  const newToken = await token.generateJWT(username, host)
  res.json({ "token" : newToken })  
}

module.exports = { addDevice, addUser, checkForUserAndPass, validateUser, validateDevice, sendToken }