const express = require('express')
const routes = require('./routes')
const mongo = require('./mongo')

const PORT = process.env.API_PORT || 4000

const app = express()

app.use('/', routes)

mongo.connect()

app.listen(PORT, function() {
  console.log('[ AUTH ] - Service Started:', PORT)
})
