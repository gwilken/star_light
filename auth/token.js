const jwt = require('jsonwebtoken');
const secret = require('./secret');

const token = {
  generateJWT: (username, host) => {
    let now =  Math.floor(Date.now() / 1000);
    let token = jwt.sign({
      username: username,
      origin: host,
      exp: now + (60 * 60),
    }, secret);

    console.log(`[ TOKEN ] - JWT generated for ${username}@${host} at ${now}`)
    return token;
  },

  verify: (token) => {
    try {
      let res = jwt.verify(token, secret)
      return res
    } catch(err) {
      console.log('[ TOKEN ] - Invalid token.')
      return null
    }
  },

  getTokenFromQueryParam: (str) => {
    try {
      let wsToken = str.split('/?token=')[1]
      return wsToken
    } catch (err) {
      console.log('[ TOKEN ] - Error deriving token from websocket param.')
      return null
    }
  },

  toAuthJSON: (_id, username) => {
    return {
      _id: _id,
      username: username,
      token: this.generateJWT(),
    };
  }
}

module.exports = token;