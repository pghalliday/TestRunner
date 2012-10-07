var events = require('events'),
    util = require('util'),
    http = require('http'),
    fs = require('fs'),
    sockJS = require('sockjs'),
    RunnerConnection = require('./RunnerConnection'),
    ListenerConnection = require('./ListenerConnection');

function Server(port, socketIoLogLevel) {
  var self = this,
    listenerConnections = [];

  // create the HTTP server
  var httpServer = http.createServer(function(request, response) {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.createReadStream('./src/Listener/Listener.html').pipe(response);
  });

  // Create a SockJS instance for the Listener interface
  var listenerSocket = sockJS.createServer({
    log: function(severity, message) {
      // do nothing for now
    }
  });

  // accept listeners
  listenerSocket.on('connection', function(connection) {
    var listenerConnection = new ListenerConnection();
    connection.pipe(listenerConnection);
    listenerConnection.pipe(connection);
    listenerConnections.push(listenerConnection);
  });

  // Create a SockJS instance for the Runner interface
  var runnerSocket = sockJS.createServer({
    log: function(severity, message) {
      // do nothing for now
    }
  });

  // accept runners
  runnerSocket.on('connection', function(connection) {
    var runnerConnection = new RunnerConnection(listenerConnections);
    connection.pipe(runnerConnection);
    runnerConnection.pipe(connection);
  });

  // bind the SockJS instances to the HTTP server
  listenerSocket.installHandlers(httpServer, {
    prefix: '/Listener'
  });
  runnerSocket.installHandlers(httpServer, {
    prefix: '/Runner'
  });

  self.start = function(callback) {
    self.once('started', callback);
    httpServer.listen(port, function() {
      self.emit('started');
    });
    return self;
  };

  self.stop = function(callback) {
    self.once('stopped', callback);
    httpServer.close(function() {
      self.emit('stopped');
    });
    return self;
  };
}
util.inherits(Server, events.EventEmitter);

module.exports = Server;
