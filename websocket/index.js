const WebSocket = require('ws');
const config = require('../config')
const token = require('../auth/token.js');

const wss = new WebSocket.Server({ port: config.ws.port });
console.log('[ WEBSOCKET ] - Server up:', config.ws.port)

const closeConnection = (client) => {
  console.log('[ WEBSOCKET ] - Closing client.')
  client.close()
}

wss.on('connection', async (client, req) => {
  let wsOrigin = req.headers.origin;
  let validated = false;

  console.log('[ WEBSOCKET ] - Client attempting to connect:', wsOrigin)
  
  try {
    let wsToken = await token.getTokenFromQueryParam(req.url)
    let verifiedToken = await token.verify(wsToken) 
   // validated = await token.validateTokenOrigin(verifiedToken, wsOrigin);
    validated = true
  
  }

  catch (err) {
    closeConnection(client);
  }

  if (validated) {
    console.log('[ WEBSOCKET ] - Client validated:', wsOrigin)

    client.on('message', message => {
      
      client.send(message)
    });
  }
});