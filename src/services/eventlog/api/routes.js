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


router.post('/subscribe',
  jsonParser,
  checkMsgSchema,
  validateMsg,
  subscribeToLog )


router.post('/publish',
  jsonParser,
  checkMsgSchema,
  validateMsg,
  publishToLog )


router.get('/retrieve/:key/:timestamp',
  validateMsg,
  sendLogs )


router.get('/health', (req, res) => {
    res.status(200).json('OK')
  } 
)

module.exports = router
