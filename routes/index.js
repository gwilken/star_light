// routes/index.js
const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const passport = require('../auth/passport');
const token = require('../auth/token');
const mongo = require('../mongo');
const log = require('../utils/log');
const { checkForUserAndPass, validateUser } = require('./middleware');

router.post('/registeruser', 
  jsonParser, 
  checkForUserAndPass,
  async (req, res) => {
    let { username, password } = req.body;
    let newUser = { username, password: await mongo.createPassword(password) }
    let insertRes = await mongo.insert(newUser)

    if (insertRes.result.ok) {
      log('[ ROUTES ] - User registerd:', newUser.username)
      res.status(200).json({"status": "registered"})
    } else {
      res.status(500)
    }
})

router.post('/gettoken', 
  jsonParser, 
  checkForUserAndPass,
  validateUser,
  async (req, res) => {
    let host = req.get('host')
    let { username } = req.body;
    const newToken = await token.generateJWT(username, host)
    res.json({ "token" : newToken })  
})


router.get('/test',
passport.authenticate('jwt', { session: false }),
jsonParser,
(req, res) => {
  res.json({
    "status": "howdy!",
    "token": req.user
  })
});

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
});

router.get('/ping', (req, res) => {
  console.log('PONG', req.get('host'))
  res.send('PONG')
})

module.exports = router