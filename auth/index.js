const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy (
  function(username, password, done) {
    //JUST TESTING...
    if(username === 'greg' && password == 'greg') {
      return done(null, 'greg')
    } else {
      return done(null, false, { message: 'Incorrect creds.' })
    }
  }
))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;