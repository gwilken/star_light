const jwt = require('jsonwebtoken');
const secret = require('./secret');
const log = require('./utils/log');

const token = {
  generateJWT: (username, host) => {
    return new Promise((resolve, reject) => {
      try {
        let now =  Math.floor(Date.now() / 1000);
        let token = jwt.sign({
          username: username,
          origin: host,
          exp: now + (60 * 60),
         // exp: now + (60),
        }, secret);

        log(`[ AUTH ] - JWT generated for ${username}@${host} at ${now}`)
        resolve(token);
      }
      catch (err) {
        log(`[ AUTH ] - Error: Can\'t generate token.`)
        reject(err)
      }
    })
  },

  verify: (token) => {
    return new Promise((resolve, reject) => {
      try {
        let res = jwt.verify(token, secret)
        resolve(res)
      } catch(err) {
        log('[ AUTH ] - Error: Token not verfied.')
        reject(err)
      }
    })
  },

  getTokenFromQueryParam: (str) => {
    return new Promise((resolve, reject) => {
      try {
        let wsToken = str.split('/?token=')[1]
        resolve(wsToken)
      } catch (err) {
        log('[ AUTH ] - Error: Can\'t get token from paramater.')
        reject(err)
      }
    })
  },

  validateTokenOrigin: (tokenStr, origin) => {
    return new Promise((resolve, reject) => {
      try {
        if (tokenStr) {
          if (tokenStr.origin === origin) {
            log('[ AUTH ] - Origin validated.')
            resolve(true);
          } else {
            throw "Token origin mismatch."
          }
        } else throw "No valid token." 
      } 
      
      catch (err) {
        log('[ AUTH ] - Error:', err)
        reject(err)
      }
    })
  }
}

module.exports = token;