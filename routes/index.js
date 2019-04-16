// routes/index.js
const router = require('express').Router();
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

  
  // router.post('/verifytoken',
  //   jsonParser,
  //   validateToken )
  
  
router.post('/validator/device',
  validateDevice, 
  ((req, res) => { res.sendStatus(200) } ))
  

router.post('/validator/admin',
  jsonParser, 
  validateAdminUser,
  ((req, res, next) => {
    res.send('OK')
  }))


router.post('/data',
  //validateDevice,
  jsonParser,
  validateDeviceData,
  addDataToRedis,
  (req, res) => {
    res.sendStatus(200)
  }
)

  
router.post('/subscriber',
  jsonParser,

)


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