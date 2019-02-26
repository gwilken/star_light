const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mongo = require('./mongo');
const config = require('./config')
const passport = require('./auth/passport');
require('./websocket');
require('./redis');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(routes)

mongo.connect()

app.listen(config.app.port, function() {
  console.log('[ EXPRESS ] - Server up:', config.app.port)
})