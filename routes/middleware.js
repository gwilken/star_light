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

module.exports = { checkForUserAndPass }