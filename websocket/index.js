const WebSocket = require('ws');
const config = require('../config')
const token = require('../auth/token.js');
const RedisSub = require('../redis/RedisSubscriber')
const redis = require('redis')
const log = require('../utils/log')

const wss = new WebSocket.Server({ port: config.ws.port });
log('[ WEBSOCKET ] - WS Server up:', config.ws.port)


const closeConnection = (client) => {
  log('[ WEBSOCKET ] - Closing client.')
  client.send('Client not validated. Closing connection.')
  client.close()
}


const parseMessage = (str, wsClient, redisClient) => {
  try {
    let json = JSON.parse(str) || {}

    if (json.message.key && json.message.type) {

      switch (json.message.type) {
        
        case 'set':
          if (json.message.value) {
            try {
              let redisPub = redis.createClient(config.redis.port, config.redis.host)
              redisPub.set(json.message.key, json.message.value, (err, res) => {
                if (err) {      
                  wsClient.send(JSON.stringify({
                    type: 'error',
                    timestamp: Date.now(),
                    message: err
                  }))
                }
              })
              redisPub.quit()
            } catch (err) {
              log('[ WEBSOCKET ] - Error:', err)
            }
          }
        break;

        case 'hmset':
          if (json.message.value) {
            let arr = []
            arr.push(json.message.key)
    
            Object.entries(json.message.value).forEach(elem => {
              arr.push(elem[0])
              arr.push(elem[1])
            })

            let redisPub = redis.createClient(config.redis.port, config.redis.host)
            redisPub.hmset(arr, (err, res) => {
              if (err) {      
                wsClient.send(JSON.stringify({
                  type: 'error',
                  timestamp: Date.now(),
                  message: err
                }))
              }
            })
            redisPub.quit()
          }
        break;

        case 'subscribeToKey':
          log('subtokey')

            let redisSubKey = new RedisSub()

            redisSubKey.subscribeToKey(json.message.key);

            redisSubKey.onKeyChange( (key, event) => {
              redisClient.get(key, (err, value) => {
                if (err) {
                  wsClient.send(JSON.stringify({
                    type: 'error',
                    timestamp: Date.now(),
                    message: err
                  }))
                } else { 
                  wsClient.send(JSON.stringify({
                    message: {
                      key,
                      event,
                      value,
                      timestamp: Date.now(),
                      type: 'keyChanged',
                    }
                  }))
                }
              })
            })
          
        break;
        
        case 'subscribeToSeries':
          log('subscribeToSeries')
        
            try {
              let redisSubTimeseries = new RedisSub()

              redisSubTimeseries.subscribeToKey(json.message.key);

              redisSubTimeseries.onKeyChange( (key, event) => {
              
                redisClient.zrange(key, -1, -1, 'WITHSCORES', (err, val) => {
                  let [hashkey, keyAsTimestamp] = val
                  log('timestamp:', keyAsTimestamp, 'hashkey:', hashkey) 
                
                  redisClient.hgetall(hashkey, (err, hashVal) => {
                    log('hash:', hashVal)

                    let data = {
                      message: {
                        key,
                        event,
                        hashkey,
                        hashVal,
                        keyAsTimestamp,
                        timestamp: Date.now()
                      }
                    }
                    
                    wsClient.send(JSON.stringify(data))

                  })
                })
              })
            } catch (err) {
              log('[ WEBSOCKET ] - Error subscribeToSeries:', err)
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
    }
  } catch (err) {
    log('err parsing json:', err)
  }
}


wss.on('connection', async (wsClient, req) => {
  let wsOrigin = req.headers.origin;
  let validated = false;

  log('[ WEBSOCKET ] - Client attempting to connect:', wsOrigin)
  
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
    log('[ WEBSOCKET ] - Client validated:', wsOrigin)
    
    let redisClient = redis.createClient(config.redis.port, config.redis.host)

    wsClient.on('message', (msg) => {
      parseMessage(msg, wsClient, redisClient)
    })
  }
});