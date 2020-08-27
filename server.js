let osc = require('node-osc');

let express = require('express');
const http = require('http');
  url = require('url');
  path = require('path');
  WebSocket = require('ws');

let app = express();
  server = http.createServer(app);
  wss = new WebSocket.Server({ server: server });

let connects = []

app.use(express.static(path.join(__dirname, '/public')));

let oscClient = new osc.Client('127.0.0.1', 6000);
let oscServer = new osc.Server(3333, '0.0.0.0', () => {
  console.log('OSC Server is listening');
});

oscServer.on('message', function(message) {
  console.log('[OSC]Recieved: ');
  console.log(message);

  let sendMessage;

  switch (message[0]) {
    case '/address1':
      console.log('address1');
      broadcast('address1');
      sendMessage = new osc.Message('/address1');
      sendMessage.append('a');
      oscClient.send(sendMessage);
      break;
    case '/address2':
      console.log('address2');
      broadcast('address2');
      sendMessage = new osc.Message('/address2');
      sendMessage.append('b');
      oscClient.send(sendMessage);
      break;
    default:
      break;
  }
});

wss.on('connection', function(ws, req) {
  let location = url.parse(req.url, true);

  let initMessage = { message: 'connection' };
  ws.send(JSON.stringify(initMessage));
  connects.push(ws);
  console.log('[WS]New Client Connected: ' + connects.length);

  ws.on('message', function(message) {
    console.log('[WS]Recieved: %s', message);
  });

  ws.on('close', function() {
    console.log('[WS]Client Leave');
    connects = connects.filter(function(conn, i) {
      return (conn == ws) ? false : true;
    });
  });
});

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});

function broadcast(message) {
  connects.forEach(function (socket, i) {
    socket.send(message);
  });
}