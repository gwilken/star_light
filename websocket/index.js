const WebSocket = require('ws');

const createSocketServer = (req, res, next) => {  
  let { port } = req.body

  const wss = new WebSocket.Server({ port });
  console.log('[ WEBSOCKET ] - Server on:', port)

  wss.on('connection', client => {
    client.on('message', message => {
      console.log('received: %s', message);
      
    });
   
    //ws.send('something');
  });

  next()
}

module.exports = createSocketServer;