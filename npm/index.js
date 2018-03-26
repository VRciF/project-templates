
///// webserver from https://gist.github.com/ryanflorence/701407

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  fs.stat(filename, function(err,stats) {
    if (err) {
      response.writeHead(404, {'Content-Type': 'text/plain'})
      response.write('404 Not Found\n')
      response.end()
      return
    }

    if (stats.isDirectory()) filename += '/index.html'

    fs.readFile(filename, 'binary', function(err, file) {
      if(err) {
        response.writeHead(500, {'Content-Type': 'text/plain'})
        response.write(err + '\n')
        response.end()
        return
      }
      response.writeHead(200)
      response.write(file, 'binary')
      response.end()
    })
  })

}).listen(parseInt(port, 10));

//console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

///// websocket server

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
