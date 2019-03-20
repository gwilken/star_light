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
  sendToken } = require('./middleware');

router.post('/registeruser', 
  jsonParser, 
  checkForUserAndPass,
  addUser
)

router.post('/registerdevice', 
  jsonParser, 
  addDevice
)

router.post('/gettoken', 
  jsonParser, 
  checkForUserAndPass,
  validateUser,
  sendToken
)

router.post('/verifytoken',
jsonParser,
async (req, res) => {
  
  try {
    let verifiedToken = await token.verify(req.body.token)
    
    res.json({
      "status": "howdy!",
      "token": verifiedToken
    })
  }
  
  catch (err) {
    res.json({
      "error": err
    })
  }
})

router.post('/validatedevice',
  validateDevice,
  (req, res) => {
    res.json('ok')
  }
)

router.get('/ping', (req, res) => {
  res.send('PONG')
})

router.post('/devicedata',
//validateDevice,
jsonParser, 
(req, res) => {
  console.log(req.body)

  res.json('ok')
})

module.exports = router