const WebSocket = require('ws');
const config = require('../config')
const token = require('../auth/token.js');

const wss = new WebSocket.Server({ port: config.ws.port });
console.log('[ WEBSOCKET ] - Server up:', config.ws.port)

wss.on('connection', (client, req) => {
  let validated = false;
  let wsOrigin = req.headers.origin
  
  console.log('[ WEBSOCKET ] - Client attempting to connect:', wsOrigin)
  let wsToken = token.getTokenFromQueryParam(req.url)

  if (wsToken) {
    let decodedToken = token.verify(wsToken)
    
    if (decodedToken) {
      if (config.ws.strictOriginChecking && (decodedToken.origin !== wsOrigin)) {
        console.log('[ WEBSOCKET ] - Token and Websocket client not same origin!')
        console.log('[ WEBSOCKET ] - Closing client:', wsOrigin)
        client.close();
      } else {
        validated = true
        console.log('[ WEBSOCKET ] - Client validated:', decodedToken.username, wsOrigin)
      }
    } else {
        console.log('[ WEBSOCKET ] - No valid token, closing client.')
        client.close();
    }
  }

  client.on('message', message => {
    if(validated) {
      console.log('VALIDATED?', validated)
      console.log('MESSAGE', message)
    }
  });
  
  //ws.send('something');
});