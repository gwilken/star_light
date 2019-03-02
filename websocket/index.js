const WebSocket = require('ws');
const config = require('../config')
const token = require('../auth/token.js');
const RedisSub = require('../redis/RedisSubscriber')
const redis = require('redis')

const wss = new WebSocket.Server({ port: config.ws.port });
console.log('[ WEBSOCKET ] - Server up:', config.ws.port)


const closeConnection = (client) => {
  console.log('[ WEBSOCKET ] - Closing client.')
  client.send('Client not validated. Closing connection.')
  client.close()
}


const parseMessage = (str, wsClient, redisClient) => {
  try {
    let json = JSON.parse(str) || {}

    switch (json.message.type) {
      case 'subscribeToKey':
        if (json.message.key) {
          let redisSubKey = new RedisSub()

          redisSubKey.subscribeToKey(json.message.key);

          redisSubKey.onKeyChange( (key, event) => {
            redisClient.get(key, (err, value) => {
              if(!err) {
                
                let data = {
                  message: {
                    key,
                    event,
                    value,
                    timestamp: Date.now(),
                    type: 'keyChanged',
                  }
                }
                
                wsClient.send(JSON.stringify(data))
              } else {
                throw err
              }
            })
          })
        }
      break;
      
      case 'subscribeToTimeSeries':
      console.log('subscribeToTimeSeries')
        if (json.message.key) {
          try {
            let redisSubTimeseries = new RedisSub()

            redisSubTimeseries.subscribeToKey(json.message.key);

            redisSubTimeseries.onKeyChange( (key, event) => {
            
              redisClient.zrange(key, -1, -1, 'WITHSCORES', (err, val) => {
                let [hashkey, keyAsTimestamp] = val
                console.log('timestamp:', keyAsTimestamp, 'hashkey:', hashkey) 
              
                redisClient.hgetall(hashkey, (err, hashVal) => {
                  console.log('hash:', hashVal)

                  let data = {
                    message: {
                      key,
                      event,
                      hashkey,
                      hashVal,
                      keyAsTimestamp,
                      timestamp: Date.now(),
                      type: 'subscribeToTimeSeries',
                    }
                  }
                  
                  wsClient.send(JSON.stringify(data))

                })
              })

              // redisClient.hmgetall(key, (err, value) => {
              //   if(!err) {
                  
              //     console.log(value)

                  // let data = {
                  //   message: {
                  //     key,
                  //     event,
                  //     value,
                  //     timestamp: Date.now(),
                  //     type: 'keyChanged',
                  //   }
                  // }
                  
                  // wsClient.send(JSON.stringify(data))
              //   } else {
              //     throw err
              //   }
              // })
            })
          } catch (err) {
            console.log('[ WEBSOCKET ] - Error subscribeToTimeSeries:', err)
          }
        }
      break;

      case 'subscribeToEvent':
        if(json.message.event) {
          let redisSubEvent = new RedisSub()

          redisSubEvent.subscribeToEvent(json.message.event)
          
          redisSubEvent.onEventChange( (event, key) => {
            wsClient.send(`${event}, ${key}`)

          })

        }
    }

  } catch (err) {
    console.log('err parsing json')
  }
}


const subscribeToKey = (key) => {
  let redisSub = new RedisSub()

  redisSub.subscribeToKey('ztest');
  redisSub.subscribeToEvent('zadd');

  redisSub.onEventChange((event, key) => {
    console.log('event', event, 'key', key)
  } )
}




wss.on('connection', async (wsClient, req) => {
  let wsOrigin = req.headers.origin;
  let validated = false;

  console.log('[ WEBSOCKET ] - Client attempting to connect:', wsOrigin)
  
  try {
    //let wsToken = await token.getTokenFromQueryParam(req.url)
    //let verifiedToken = await token.verify(wsToken) 
   // validated = await token.validateTokenOrigin(verifiedToken, wsOrigin);
    validated = true
  }

  catch (err) {
    closeConnection(client);
  }

  if (validated) {
    console.log('[ WEBSOCKET ] - Client validated:', wsOrigin)
    
    let redisClient = redis.createClient(config.redis.port, config.redis.host)

    wsClient.on('message', (msg) => {
      parseMessage(msg, wsClient, redisClient)
    })
    
  }
});