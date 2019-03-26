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
  parseDeviceData,
  validateToken,
  getHashsFromSet,
  getHashsFromSetByScore } = require('./middleware');


router.post('/registeruser', 
  jsonParser, 
  validateAdminUser,
  addUser )


// router.post('/validateadmin',
//   jsonParser, 
//   validateAdminUser,
//   ((req, res, next) => {
//     res.send('OK')
//   }))


router.post('/registerdevice', 
  jsonParser,
  validateAdminUser, 
  addDevice )


router.post('/gettoken', 
  jsonParser, 
  checkForUserAndPass,
  validateUser,
  sendToken )


router.post('/verifytoken',
  jsonParser,
  validateToken )


router.post('/validatedevice',
  validateDevice, 
  ((req, res) => { res.sendStatus(200) } ))


router.post('/devicedata',
  validateDevice,
  parseDeviceData )

  
router.post('/gethashesfromset',
  validateToken,
  getHashsFromSet
)


router.post('/gethashesfromsetbyscore',
  validateToken,
  getHashsFromSetByScore
)


router.post('/ping', (req, res) => { res.send('PONG') })
  
module.exports = router