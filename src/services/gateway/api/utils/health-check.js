const request = require('request-promise-native')

const healthCheck = (url) => {
  return new Promise( async (resolve, reject) => {
    let checkRes = null
  
    try {
      checkRes = await request({ url })
    }
  
    catch (err) {
      resolve({
        status: false,
        err: err.cause
      })
    }
  
    if (checkRes) {
      resolve({
        status: true,
        err: null
      })
    }
  })
}

module.exports = healthCheck
