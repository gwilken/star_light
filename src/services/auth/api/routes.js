// routes.js

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
  validateToken,
  validateKey,
  validateHeaderAuthorizationToken,
  validateHeaderAuthorizationKey } = require('./middleware');


router.post('/users', 
  jsonParser, 
 // validateAdminUser,
  addUser )


router.post('/devices', 
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
  validateHeaderAuthorizationToken,
  ((req, res) => {
    res.sendStatus(200)
  }))
  

router.post('/verifykey',
  jsonParser,
  validateHeaderAuthorizationKey,
  ((req, res) => {
    res.sendStatus(200)
  })
)


router.get('/health', (req, res) => {
    res.status(200).json('OK')
  } 
)


module.exports = router
