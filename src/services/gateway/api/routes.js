// eventlog/api/routes.js
const router = require('express').Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const log = require('./utils/log');
const { 
  checkMsgSchema,
  validateMsg,
  publishToEventLog } = require('./middleware');

  
router.post('/events',
  jsonParser, 
  // validateMsg,
  checkMsgSchema,
  publishToEventLog,
  (req, res) => {
    log('[ GATEWAY ] - post /events OK.')
    res.status(200).json('OK')
  } 
)

// TODO: write get logic from influxdb
router.get('/events',
  jsonParser, 
  // validateMsg,
  // checkMsgSchema,
  (req, res) => {
    log('[ GATEWAY ] - get /events OK.')
    res.status(200).json('OK')
  } 
)

router.get('/health', (req, res) => {
    log('[ GATEWAY ] - Health check OK.', req.body)
    res.status(200).json('OK')
  } 
)

module.exports = router
