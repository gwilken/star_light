// routes/index.js
const router = require('express').Router();
//const mongo = require('./mongo');

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const { 
  checkForUserAndPass, 
  validateUser,
  validateAdminUser, 
  validateDevice, 
  addUser, 
  addDevice, 
  sendToken,
  validateJsonBodyData,
  validateDeviceData,
  addDataToRedis,
  validateToken,
  validateHeaderAuthorizationToken,
  getHashsFromSet,
  getHashsFromSetByScore } = require('./middleware');


router.post('/users', 
  jsonParser, 
  validateAdminUser,
  addUser )


router.post('/devices', 
  jsonParser,
  validateAdminUser, 
  addDevice )
  
router.post('/gettoken', 
  jsonParser, 
  //checkForUserAndPass,
  //validateUser,
  sendToken )

  
router.post('/verifytoken',
  jsonParser,
  validateHeaderAuthorizationToken,
  ((req, res) => {
    res.sendStatus(200)
  }))
  
  
router.post('/device-validator/device',
  validateDevice, 
  ((req, res) => { res.sendStatus(200) } ))
  

router.post('/user-validator/admin',
  jsonParser, 
  validateAdminUser,
  ((req, res, next) => {
    res.send('OK')
  }))


router.post('/device-data/:deviceId',
  //validateDevice,
  jsonParser,
  validateDeviceData,
  addDataToRedis,
  (req, res) => {
    res.sendStatus(200)
  }
)

  

// TODO: device subscribe endpoint, 
// opens websocket server bound to redis sub, res includes
// socket port? 

// router.post('/device-subscriber',
//   jsonParser,

// )


router.post('/gethashesfromset',
 // validateToken,
  getHashsFromSet
)


router.post('/gethashesfromsetbyscore',
  //validateToken,
  getHashsFromSetByScore
)

router.get('/test/:device', 
  validateHeaderAuthorizationToken,
  (req, res) => {
    console.log(req.params.device)
    console.log(req.headers.authorization)

    res.sendStatus(200)
})


router.post('/ping', (req, res) => { res.send('PONG') })
  
module.exports = router