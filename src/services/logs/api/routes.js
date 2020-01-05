// eventlog/api/routes.js

const router = require('express').Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const request = require('request')
const log = require('./utils/log');

const EVENTLOG_PATH = process.env.EVENTLOG_PATH || 'http://localhost:5000/retrieve'

const { 
  checkMsgSchema,
  validateMsg,
  publishToElastic } = require('./middleware');


router.post('/notify', 
  jsonParser, 
  validateMsg,
  (req, res) => {
    log('[ LOGS ] - Notify OK.')
      res.status(200).json('OK')

      request({ 
        url: `${EVENTLOG_PATH}/telemetry/1`,
        headers: { 'Authorization': req.headers.authorization },
        method: 'GET'
      }, (err, authRes, body) => {
        if (err) {
          console.log('error:', err)
        } else if (authRes && authRes.statusCode == 200) {
          console.log('body?:', body)
        }
      })
    } 
)


// router.post('/log', jsonParser, (req, res) => {
//   log('body:', req.body)
//     res.status(200).json(req.body)
//   } 
// )


router.get('/health', (req, res) => {
    log('[ LOGS ] - Health check OK.', req.body)
    res.status(200).json('OK')
  } 
)


module.exports = router
