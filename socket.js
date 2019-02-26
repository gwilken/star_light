var net = require('net');

const port = 1337;
const host = '127.0.0.1';
const server = net.createServer();

server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');
});

let sockets = [];

server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', function(data) {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        // sockets.forEach(function(sock, index, array) {
        //     sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        // });
    });
});