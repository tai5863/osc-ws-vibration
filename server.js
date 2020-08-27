let express = reqire('express');
  http = reqire('http');
  url = reqire('url');
  path = reqire('path');
  webSocket = reqire('ws');

let app = express();
  server = http.createServer(app);
  wss = new webSocket.Server({ server: server });

let connects = []

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