const mongo = require('./mongo');
const token = require('./token');
const log = require('./utils/log');


const addDevice = async (req, res, next) => { 
  let { device_id, key } = req.body;
  let newDevice = { device_id, key: await mongo.createPassword(key) }
  mongo.connect()
  mongo.collection = mongo.collection = mongo.db.collection('devices')
  let insertRes = await mongo.insert(newDevice)
  if (insertRes.result.ok) {
    log('[ AUTH ] - Device registerd:', newDevice.device_id)
    mongo.close();
    res.status(200).json({"status": "registered"})
  } else {
    next('[ AUTH ] - Error registering device:', username)
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
    log('[ AUTH ] - User registerd:', newuser)
    res.status(200).json({"status": "registered"})
  } else {
    next('[ AUTH ] - Error registering user:', newuser)
  }
}


const checkForUserAndPass = (req, res, next) => {
  if (!req.body.username) {
    res.status(422).json({
      error: 'username is required.',
    })
    next('[ AUTH ] - Error, username is required.')
  }
  if (!req.body.password) {
    res.status(422).json({
      error: 'password is required.',
    })
    next('[ AUTH ] - Error, password is required')
  }
  next()
}


const validateAdminUser = async (req, res, next) => {
  let dbUser = await mongo.findUser(req.body.username)
  const failValidation = (err) => {
    res.status(403).json({
      error: 'Validation failed.',
    })
    next(`[ AUTH ] - Error: Validation failed: ${err}`)
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
    next(`[ AUTH ] - Error: Validation failed: ${err}`)
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
  let device = await mongo.findDevice(req.body.device_id)
  const failValidation = (err) => {
    res.status(403).json({
      error: 'Device validation failed.',
    })
    next(`[ AUTH ] - Error: Device validation failed: ${err}`)
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


const validateKey = async (req, res, next) => {
  let device = await mongo.validateKey(req.body.key)
  const failValidation = (err) => {
    res.status(403).json({
      error: 'Validation failed.',
    })
    next(`[ AUTH ] - Error: Validation failed. ${err}`)
  }
  if (device) {
    next()
  } else {
    failValidation('Key not found.')
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



const validateHeaderAuthorizationToken = async (req, res, next) => {
  try {  
    let verifiedToken = await token.verify(req.headers.authorization)
    if (!verifiedToken) {
      res.sendStatus(403)
    } else {
      // log('[ AUTH ] - Token Validated.')
      next()
    }
  }
  catch (err) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log('[ AUTH ] - Header authorization token not valid:', ip)
    res.sendStatus(403)
  }
}


const validateHeaderAuthorizationKey = async (req, res, next) => {
  let device = await mongo.validateKey(req.headers.authorization)
  const failValidation = (err) => {
    res.status(403).json({
      error: 'Validation failed.',
    })
    next(`[ AUTH ] - Error: Validation failed. ${err}`)
  }
  if (device) {
    next()
  } else {
    failValidation('Key not found.')
  }
}


const sendToken = async (req, res, next) => {
  let host = req.get('host')
  let { username } = req.body;
  const newToken = await token.generateJWT(username, host)
  res.json({ "token" : newToken })  
}


const validateJsonBodyData = (req, res, next) => {
  console.log(req.body)
  try {
    JSON.parse(req.body)
    next()
  }
  catch (err) {
    log('[ AUTH ] - Error validating JSON.', err)
    res.sendStatus(400)
  }
}


module.exports = { 
  addDevice, 
  addUser, 
  checkForUserAndPass,
  validateAdminUser,
  validateUser,
  validateDevice,
  sendToken,
  validateJsonBodyData,
  validateKey,
  validateToken,
  validateHeaderAuthorizationToken,
  validateHeaderAuthorizationKey
}
