const express = require('express');
//const bodyParser = require('body-parser');
const routes = require('./routes');
const mongo = require('./mongo');
const config = require('./config')
//const passport = require('./auth/passport');
//require('./websocket');

const app = express()

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(passport.initialize());
app.use('/api', routes)

mongo.connect()

app.listen(config.app.port, function() {
  console.log('[ EXPRESS ] - REST Server up:', config.app.port)
})