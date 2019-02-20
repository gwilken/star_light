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
//app.use(express.static(path.join(__dirname, 'public')));
app.use(routes)

const isProduction = process.env.NODE_ENV === 'production';

console.log('[ SERVER ] - Production check:', isProduction)

mongo.connect()

// passport.use(new BasicStrategy (
//   function(username, password, done) {
//     //JUST TESTING...
//     if(username === 'greg' && password == 'greg') {
//       return done(null, 'greg')
//     } else {
//       return done(null, false, { message: 'Incorrect creds.' })
//     }
//   }
// ))

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// app.use(express.static('../frontend/build'))
// app.use(passport.initialize());
// app.use('/', routes)

app.listen(config.app.port, function() {
  console.log('[ EXPRESS ] - Server listening on:', config.app.port)
})