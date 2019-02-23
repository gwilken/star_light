// routes/index.js
const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const passport = require('../auth/passport');
const token = require('../auth/token');
const mongo = require('../mongo');

router.post('/registeruser', jsonParser, async (req, res) => {
  let user = req.body;

  if (!user.username) {
    res.status(422).json({
      errors: {
        username: 'is required',
      },
    })
  }

  if (!user.password) {
    res.status(422).json({
      errors: {
        password: 'is required',
      },
    })
  }

  let newUser = {
    username: user.username,
    password: await mongo.createPassword(user.password) 
  }

  let result = await mongo.insert(newUser)

  if (result.result.ok) {
    console.log('[ ROUTES ] - User registerd:', newUser.username)
    res.status(200).json({"status": "registered"})
  } else {
    res.status(500)
  }
})

router.post('/gettoken', jsonParser, async (req, res) => {
  let host = req.get('host')
  let user = req.body;

  if (!user.username) {
    res.status(422).json({
      error: 'username is required'
    })
  }

  if (!user.password) {
    res.status(422).json({
      error: 'password is required'
    })
  }

  let dbUser = await mongo.findUser(user.username)

  if (dbUser) {
    let isValid = await mongo.validatePassword(user.password, dbUser.password) 

    if (isValid) {
      const newToken = token.generateJWT(user.username, host)
      res.json({ "token" : newToken })
    } else {
      res.sendStatus(403)
    }
  }  
  
  res.sendStatus(403)
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