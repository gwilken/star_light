const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const mongo = require('./mongo');
const config = require('./config')
const passport = require('./auth');

require('./redis');
require('./models/userSchema');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(routes)

const isProduction = process.env.NODE_ENV === 'production';

console.log('[ SERVER ] - Production check:', isProduction)

mongo.connect()

app.listen(config.app.port, function() {
  console.log('[ EXPRESS ] - Server listening on:', config.app.port)
})