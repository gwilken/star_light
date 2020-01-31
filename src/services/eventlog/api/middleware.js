// eventlog/api/middleware.js
const request = require('request')
const redisManager = require('./RedisManager')
const log = require('./utils/log');
const AUTH_PATH = process.env.AUTH_PATH || 'http://localhost:4000/verifytoken/'


let subscribedSet = new Set()

const checkMsgSchema = (req, res, next) => {
  const failValidation = () => {
    log('[ EVENTLOG ] - Message schema validation failed.')
    res.status(400).json('Message schema validation failed.')
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
    if (req.body['timestamp'] && req.body['type'] && req.body['subscriber_url'] && req.body['subscriber_path']) {
      next()
    } else {
      failValidation()
    }
  }
}


const validateMsg = (req, res, next) => {
  request({ url: AUTH_PATH,
    method: 'POST',
    headers: { 'Authorization': req.headers.authorization },
  }, function (err, authRes) {
    if (!err && authRes.statusCode == 200) {
        next()
    } else {
      res.status(403).json('Message validation failed.')
    }
  })
}


// TODO: check if previously subscribed. a set?

const subscribeToLog = async (req, res, next) => {
  const { type, subscriber_url, subscriber_path } = req.body

  const failSubscribe = () => {
    res.status(503).json('Subscribe to service failed.')
  }

  request.get(`${subscriber_url}/health`, {}, (err, healthRes) => {
    if (err) {
      log('[ EVENTLOG ] - Error: service unavailable, health check failed:', err)
      failSubscribe()
    } 
    
    else if (healthRes.statusCode !== 200) {
      failSubscribe()
    } 
    
    else {

      if (subscribedSet.has(`${subscriber_url}/${subscriber_path}`)) {
        log('[ EVENTLOG ] - Already subscribed.')
        failSubscribe()
      } else {
        // TODO: wrap in promise
        redisManager.subscribeToKey(type, async (event) => {
          let msg = await redisManager.getLastValue(type)
          
          request({ 
            url: `${subscriber_url}/${subscriber_path}`,
            headers: { 'Authorization': req.headers.authorization },
            method: 'POST',
            json: true,
            body: { msg }
          }, (err) => {
            if (err) {
              log('[ EVENTLOG ] - Error: reaching subscribed service:', err)
            } 
          })
        })

        subscribedSet.add(`${subscriber_url}/${subscriber_path}`)
        
        next()
      }
    } 
  })
}

// TODO: error check here!
const publishToLog = async (req, res, next) => {
  await redisManager.publishToSet(req.body)
  next()
}


const sendLogs = async (req, res, next) => {
  let { key, timestamp } = req.params

  console.log('[ EVENTLOG ] - req params:', key, timestamp)

  let logs = await redisManager.getAfterTimestamp(key, timestamp)
  
  console.log('logs:', logs)
  
  res.status(200).json(logs)
}


module.exports = {
  checkMsgSchema,
  validateMsg,
  subscribeToLog,
  publishToLog,
  sendLogs
}
