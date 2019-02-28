const WebSocket = require('ws');
const config = require('../config')
const token = require('../auth/token.js');
const RedisSub = require('../redis/RedisSubscriber')

const wss = new WebSocket.Server({ port: config.ws.port });
console.log('[ WEBSOCKET ] - Server up:', config.ws.port)

const closeConnection = (client) => {
  console.log('[ WEBSOCKET ] - Closing client.')
  client.send('Client not validated. Closing connection.')
  client.close()
}

wss.on('connection', async (client, req) => {
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
    let redisSub = new RedisSub()
    
    redisSub.subscribeToKey('ztest');
    redisSub.subscribeToEvent('zadd');

    redisSub.onKeyChange((key, event) => {
      console.log('key', key, 'event', event)
    } )
 
    // redisSub.onEventChange((event, key) => {
    //   console.log('event', event, 'key', key)
    // } )

  }
});