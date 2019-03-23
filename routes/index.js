// routes/index.js
const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const token = require('../auth/token');
const { 
  checkForUserAndPass, 
  validateUser, 
  validateDevice, 
  addUser, 
  addDevice, 
  sendToken,
  parseDeviceData,
  validateToken } = require('./middleware');

router.post('/registeruser', 
  jsonParser, 
  checkForUserAndPass,
  addUser )

router.post('/registerdevice', 
  jsonParser, 
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

router.get('/ping', (req, res) => {
  console.log('PONG')
  res.send('PONG')
})

router.post('/devicedata',
  validateDevice,
  parseDeviceData )

module.exports = router