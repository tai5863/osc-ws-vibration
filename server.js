let express = require('express');
  http = require('http');
  url = require('url');
  path = require('path');
  webSocket = require('ws');

let app = express();
  server = http.createServer(app);
  wss = new webSocket.Server({ server: server });

let connects = []

app.use(express.static(path.join(__dirname, '/public')));

wss.on('connection', function(ws, req) {
  let location = url.parse(req.url, true);
  
  let initMessage = { message: 'connection' };
  ws.send(JSON.stringify(initMessage));
  connects.push(ws);
  console.log('New Client Connected: ' + connects.length);

  ws.on('message', function() {
    console.log('recieved: %s', message);
    broadcast(message);
  });

  ws.on('close', function() {
    console.log('Client Leave');
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