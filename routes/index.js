// routes/index.js
const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const passport = require('../auth/passport');
const token = require('../auth/token');
const mongo = require('../mongo');
const { checkForUserAndPass } = require('./middleware');

router.post('/registeruser', 
  jsonParser, 
  checkForUserAndPass,
  async (req, res) => {
    let { username, password } = req.body;
    let newUser = { username, password: await mongo.createPassword(password) }
    let insertRes = await mongo.insert(newUser)

    if (insertRes.result.ok) {
      console.log('[ ROUTES ] - User registerd:', newUser.username)
      res.status(200).json({"status": "registered"})
    } else {
      res.status(500)
    }
})

router.post('/gettoken', 
  jsonParser, 
  checkForUserAndPass,
  async (req, res) => {
    let host = req.get('host')
    let { username, password } = req.body;

    let dbUser = await mongo.findUser(username)

    if (dbUser) {
      let isValid = await mongo.validatePassword(password, dbUser.password) 

      if (isValid) {
        const newToken = token.generateJWT(username, host)
        res.json({ "token" : newToken })
      } else {
        res.sendStatus(403)
      }
    } else {
      res.sendStatus(403)
    }
})

router.post('/test',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  (req, res) => {
    res.json({
      "status": "howdy!",
      "token": req.token
    })
  });
  
router.post('/test2',
  jsonParser,
  (req, res) => {
    console.log('host:', req.get('host'))

    console.log('Valid token?:', token.verify(req.body.token))

    res.json({
      "status": "howdy!",
      "token": req.body.token
    })
  });


module.exports = router