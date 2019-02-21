// routes/index.js
const router = require('express').Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const passport = require('../auth');
const mongo = require('../mongo');
const userSchema = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const socketServer = require('../websocket');

router.post('/register', jsonParser, async (req, res) => {
  let user = req.body;

  if (!user.email) {
    res.status(422).json({
      errors: {
        email: 'is required',
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
    email: user.email,
    password: await userSchema.createPassword(user.password) 
  }

  let result = await mongo.insert(newUser)

  if (result.result.ok) {
    console.log('[ ROUTES ] - User registerd:', newUser.email)
    res.status(200).json({"status": "registered"})
  } else {
    res.status(500)
  }
})

router.post('/validate', jsonParser, async (req, res) => {
  let user = req.body;

  if (!user.email) {
    res.status(422).json({
      errors: {
        email: 'is required',
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

  let dbUser = await mongo.findUser(user.email)

  let isValid = await userSchema.validatePassword(user.password, dbUser.password) 
  
  //console.log(dbUser, isValid)

  if (isValid) {
    const token = jwt.sign({
      exp: Math.floor((Date.now() / 1000) + 60),
      email: user.email
    }, 'coldbeer');
    res.json({ token })
  } else {
    res.sendStatus(403)
  }
})

router.post('/test',
  passport.authenticate('jwt', { session: false }),
  jsonParser,
  socketServer,
  (req, res) => {
    res.json({
      "status": "howdy!",
      "port" : req.body.port
    })
  });

module.exports = router