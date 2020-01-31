// eventlog/api/routes.js
const router = require('express').Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const log = require('./utils/log');
const { 
  checkMsgSchema,
  validateMsg,
  publishToElastic } = require('./middleware');

  
// TODO: Get last known timestamp from elastic

router.post('/notify',
  jsonParser, 
  validateMsg,
  publishToElastic,
  (req, res) => {
    log('[ LOGS ] - Notify OK.')
    res.status(200).json('OK')
  } 
)

router.get('/health', (req, res) => {
    log('[ LOGS ] - Health check OK.', req.body)
    res.status(200).json('OK')
  } 
)

module.exports = router
