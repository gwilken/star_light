// eventlog/api/routes.js

const router = require('express').Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const request = require('request-promise-native')
const log = require('./utils/log');
const healthCheck = require('./utils/health-check')
const elasticManager = require('./ElasticManager')

const EVENTLOG_HOST = process.env.EVENTLOG_HOST || 'http://localhost:5000/'

// TODO: just send the latest log along with notify


// let lastGoodTimestamp = null
let lastGoodTimestamp = 1

const { 
  checkMsgSchema,
  validateMsg,
  publishToElastic } = require('./middleware');


router.post('/notify', 
  jsonParser, 
  // validateMsg
  publishToElastic,
  (req, res) => {
    log('[ LOGS ] - Notify OK.')
    res.status(200).json('OK')
  } 
)


// router.post('/log', jsonParser, (req, res) => {
//   log('body:', req.body)
//     res.status(200).json(req.body)
//   } 
// )


router.get('/lasttimestamp', async (req, res) => {
  res.status(200).json(lastGoodTimestamp)
})


router.get('/check', async (req, res) => {
  let health = await healthCheck('http://localhost:5000/health')
  res.status(200).json(health)
})


router.get('/health', (req, res) => {
    log('[ LOGS ] - Health check OK.', req.body)
    res.status(200).json('OK')
  } 
)


router.get('/test', async (req, res) => {
  log('[ LOGS ] - Test route...')

  // elasticManager.insertTestDoc()
  
  const result = await elasticManager.getLastKnownTimestamp()

  res.status(200).json(result)
})


module.exports = router
