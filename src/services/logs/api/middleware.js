// eventlog/api/middleware.js
const request = require('request')

const log = require('./utils/log');
const AUTH_PATH = process.env.AUTH_PATH || 'http://localhost:4000/verifytoken/'


// TODO: different validations for pub / sub


const checkMsgSchema = (req, res, next) => {
  log('check Msg Schema...')

  // const failValidation = () => {
  //   res.status(400).json('Bad Request')
  // }

  // if(!req.body && req.body['action']) {
  //   failValidation()
  // }

  // if(req.body['action'] === 'publish') {
  //   if (req.body['timestamp'] && req.body['type'] && req.body['msg']) {
  //     next()
  //   } else {
  //     failValidation()
  //   }
  // } else if (req.body['action'] === 'subscribe') {
  //   if (req.body['timestamp'] && req.body['type'] && req.body['subscriber_host'] && req.body['subscriber_port']) {
  //     next()
  //   } else {
  //     failValidation()
  //   }
  // }
}


const validateMsg = (req, res, next) => {
  request({ url: AUTH_PATH,
    method: 'POST',
    headers: { 'Authorization': req.headers.authorization },
  }, function (err, authRes) {
    if (!err && authRes.statusCode == 200) {
        // log('[ LOGS ] - Token validated.')
        next()
    } else {
      log('[ LOGS ] - invalid.')
      res.status(403).json('Forbidden')
    }
  })
}


const publishToElastic = (req, res, next) => {
  // log('pubtolog', req.body)
  log('publish to elastic...')


  res.status(200).json('OK')
}


module.exports = {
  checkMsgSchema,
  validateMsg,
  publishToElastic
}
