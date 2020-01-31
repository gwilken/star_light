// eventlog/api/routes.js

const router = require('express').Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const { 
  checkMsgSchema,
  validateMsg,
  subscribeToLog, 
  publishToLog,
  sendLogs } = require('./middleware');


// TODO: not getting 200 back after sub

router.post('/subscribe',
  jsonParser,
  checkMsgSchema,
  validateMsg,
  subscribeToLog,
    (req, res) => {
      res.status(200).json('OK')
    } 
  )

router.post('/publish',
  jsonParser,
  checkMsgSchema,
  validateMsg,
  publishToLog,
    (req, res) => {
      res.status(200).json('OK')
    }
  )


router.get('/retrieve/:key/:timestamp',
  // validateMsg,
  sendLogs )


router.get('/health', (req, res) => {
    res.status(200).json('OK')
  } 
)

module.exports = router
