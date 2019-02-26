const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const secret = require('./secret')

passport.use(new JWTStrategy({
  secretOrKey : secret,
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('token')
}, async (token, done) => {
  console.log(token)
  try {
    return done(null, token);
  } catch (error) {
    console.log(error)
    done(error);
  }
}));

module.exports = passport;