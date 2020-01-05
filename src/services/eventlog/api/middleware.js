// eventlog/api/middleware.js
const request = require('request')
const redisManager = require('./RedisManager')
const log = require('./utils/log');
const AUTH_PATH = process.env.AUTH_PATH || 'http://localhost:4000/verifytoken/'


// TODO: different validations for pub / sub


const checkMsgSchema = (req, res, next) => {
  log('checkMsgSchema...')

  const failValidation = () => {
    res.status(400).json('Bad Request')
  }

  if(!req.body && req.body['action']) {
    failValidation()
  }

  if(req.body['action'] === 'publish') {
    if (req.body['timestamp'] && req.body['type'] && req.body['msg']) {
      next()
    } else {
      failValidation()
    }
  } else if (req.body['action'] === 'subscribe') {
    if (req.body['timestamp'] && req.body['type'] && req.body['subscriber_host'] && req.body['subscriber_port']) {
      next()
    } else {
      failValidation()
    }
  }
}


const validateMsg = (req, res, next) => {
  log('validateMsg...')

  request({ url: AUTH_PATH,
    method: 'POST',
    headers: { 'Authorization': req.headers.authorization },
  }, function (err, authRes) {
    if (!err && authRes.statusCode == 200) {
        log('validate success!')
        next()
    } else {
      log('validate failed!')
      res.status(403).json('Forbidden')
    }
  })
}


const subscribeToLog = (req, res, next) => {
  log('subtolog', req.body)

  const { type, subscriber_host, subscriber_port } = req.body

  redisManager.subscribeToKey(type, (event) => {
    request(
      { 
        url: `${subscriber_host}:${subscriber_port}/test`,
        // headers: { 'Authorization': req.headers.authorization },
        method: 'POST',
        json: true,
        body: {
          type,
          event
        }
      }, function (err, authRes) {
        if (!err && authRes.statusCode == 200) {
          log('success!')
        
          // TODO: handle success and fail

          next()
        } else {
          log('failed!', err)

        }
      })
  })

  res.status(200).json('OK')
}


const publishToLog = (req, res, next) => {
  // log('pubtolog', req.body)
  log('pubtolog...')

  redisManager.publishToSet(req.body)


  res.status(200).json('OK')
}


module.exports = {
  checkMsgSchema,
  validateMsg,
  subscribeToLog,
  publishToLog
}
