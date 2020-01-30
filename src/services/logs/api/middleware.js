// eventlog/api/middleware.js
const request = require('request')
const elasticManager = require('./ElasticManager')

const log = require('./utils/log');
const AUTH_PATH = process.env.AUTH_PATH || 'http://localhost:4000/verifytoken/'


// TODO: different validations for pub / sub


const checkMsgSchema = (req, res, next) => {
  log('check Msg Schema...')

  // const failValidation = () => {
  //   res.status(400).json('Bad Request')
  // }

  // if(!req.body && req.body['action']) {
  //   failValidation()
  // }

  // if(req.body['action'] === 'publish') {
  //   if (req.body['timestamp'] && req.body['type'] && req.body['msg']) {
  //     next()
  //   } else {
  //     failValidation()
  //   }
  // } else if (req.body['action'] === 'subscribe') {
  //   if (req.body['timestamp'] && req.body['type'] && req.body['subscriber_host'] && req.body['subscriber_port']) {
  //     next()
  //   } else {
  //     failValidation()
  //   }
  // }
}


const validateMsg = (req, res, next) => {
  request({ url: AUTH_PATH,
    method: 'POST',
    headers: { 'Authorization': req.headers.authorization },
  }, function (err, authRes) {
    if (!err && authRes.statusCode == 200) {
        // log('[ LOGS ] - Token validated.')
        next()
    } else {
      log('[ LOGS ] - invalid.')
      res.status(403).json('Forbidden')
    }
  })
}





const publishToElastic = (req, res, next) => {
  // log('pubtolog', req.body)
  log('publish to elastic:', req.body)

  if (req.body.msg) {
    let docs = JSON.parse(req.body.msg)
    log('[ LOGS ] - Recieved logs:', docs)

    if (docs.length > 0) {
    
      if (docs.length === 1) {
        elasticManager.insertDoc(docs[0])
      } else {
        elasticManager.bulkInsert(docs)
      }

    }
  }

  next()
}

// const requestLogs = () => {
  //   log('[ LOGS ] - Requesting last log...')
  //   return new Promise( async (resolve, reject) => {
  
  //     let docs = null
  
  //     let { status } = await healthCheck('http://localhost:5000/health') 
  
  //     if (!status) {
  //       resolve(null)
  //     }
  
  //     // if(!lastGoodTimestamp) {
  //     //   const result = await elasticManager.getLastKnownTimestamp()
  //     //   log('[ LOGS ] - Last Good Timestamp: ', result.timestamp)
  //     //   lastGoodTimestamp = result.timestamp
  //     // }
    
  
  //     try {
  //       logResponse = await request({ url: `${EVENTLOG_HOST}/retrieve/logs/${lastGoodTimestamp}` })
  //       // logResponse = await request({ url: `${EVENTLOG_HOST}/retrieve/logs/1` })
  //     }
  
  //     catch (err) {
  //       resolve({
  //         status: false,
  //         err: err
  //       })
  //     }
  
  
  //     if (logResponse) {
  //       let docs = JSON.parse(logResponse)
  //       log('[ LOGS ] - Recieved logs:', docs)
  
  //       if (docs.length > 0) {
  //         const timestamps = docs.map(doc => {
  //           let log = JSON.parse(doc)
  //           return log.timestamp
  //         })
          
  //        // console.log('timestamps', timestamps)
  
  //         // TODO: INSERT INTO ES
  
  //         if (docs.length === 1) {
  //           elasticManager.insertDoc(docs[0])
  //         } else {
  //           elasticManager.bulkInsert(docs)
  //         }
  
  //         lastGoodTimestamp = Math.max(...timestamps)
  //         log('[ LOG ] - Setting last known good log timestamp:', lastGoodTimestamp)
  //       }
  //     }
  
  //   })
  // }


module.exports = {
  checkMsgSchema,
  validateMsg,
  publishToElastic
}
