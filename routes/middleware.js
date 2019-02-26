const mongo = require('../mongo');

const checkForUserAndPass = (req, res, next) => {
  if (!req.body.username) {
    res.status(422).json({
      error: 'username is required.',
    })
    next('[ EXPRESS ] - Error, username is required.')
  }

  if (!req.body.password) {
    res.status(422).json({
      error: 'password is required.',
    })
    next('[ EXPRESS ] - Error, password is required')
  }
  next()
}

const validateUser = async (req, res, next) => {
  let dbUser = await mongo.findUser(req.body.username)

  const failValidation = (err) => {
    res.status(403).json({
      error: 'Validation failed.',
    })
    next(`[ EXPRESS ] - Error: Validation failed: ${err}`)
  }


  if (dbUser) {
    let isValid = await mongo.validatePassword(req.body.password, dbUser.password) 

    if (isValid) {
      next()
    } else {
      failValidation('Invaild password.')
    }
  } else {
    failValidation('User not found.')
  }
}

module.exports = { checkForUserAndPass, validateUser }