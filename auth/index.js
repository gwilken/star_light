const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(new JWTStrategy({
  secretOrKey : 'coldbeer',
  jwtFromRequest : ExtractJWT.fromUrlQueryParameter('token')
}, async (token, done) => {
  try {
    return done(null, token.email);
  } catch (error) {
    done(error);
  }
}));

module.exports = passport;