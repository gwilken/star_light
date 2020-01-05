// eventlog/api/routes.js

const router = require('express').Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const log = require('./utils/log');


// const { 
//   checkMsgSchema,
//   validateMsg,
//   subscribeToLog, 
//   publishToLog } = require('./middleware');


router.post('/log', jsonParser, (req, res) => {
    log('body:', req.body)
    res.status(200).json(req.body)
  } 
)


router.get('/health', (req, res) => {
    res.status(200).json('OK')
  } 
)


module.exports = router
