// eventlog/api/server.js

const express = require('express')
const routes = require('./routes')
const log = require('./utils/log')

const PORT = process.env.API_PORT || 5000

const app = express()

app.use('/', routes)

app.listen(PORT, function() {
  log('[ EVENTLOG ] - Service Started:', PORT)
})

