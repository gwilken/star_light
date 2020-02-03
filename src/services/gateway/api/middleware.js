// eventlog/api/middleware.js
const request = require('request')
const log = require('./utils/log');

const AUTH_PATH = process.env.AUTH_PATH || 'http://localhost:4000/verifytoken/'
const EVENTLOG_PATH = process.env.EVENTLOG_PATH || 'http://localhost:5000'


const validateMsg = (req, res, next) => {
  request({ url: AUTH_PATH,
    method: 'POST',
    headers: { 'Authorization': req.headers.authorization },
  }, function (err, authRes) {
    if (!err && authRes.statusCode == 200) {
        // log('[ GATEWAY ] - Token validated.')
        next()
    } else {
      log('[ GATEWAY ] - unauthorized message.')
      res.status(403).json('Forbidden')
    }
  })
}


// TODO: different check msg schema
// {
// 	"timestamp": 706,
// 	"type": "logs",
// 	"action": "publish",
// 	"msg": "test"
// }

const checkMsgSchema = (req, res, next) => {
  log('[ GATEWAY ] - check Msg Schema...')

  const failValidation = () => {
    res.status(400).json('Bad Request')
  }

  if(req.body && req.body['msg'] && req.body['timestamp']) {
    next()
  } else {
    log('[ GATEWAY ] - msg schema validation fail.')
    failValidation()
  }
}


const publishToEventLog = (req, res, next) => {
 log('[ GATEWAY ] - Pub to eventlog:', EVENTLOG_PATH + '/publish')
 next()
}


module.exports = {
  checkMsgSchema,
  validateMsg,
  publishToEventLog
}
