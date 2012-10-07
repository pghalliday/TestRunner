var events = require('events'),
    util = require('util'),
    http = require('http'),
    fs = require('fs'),
    sockJS = require('sockjs'),
    express = require('express'),
    RunnerConnection = require('./RunnerConnection'),
    ListenerConnection = require('./ListenerConnection');

function Server(port, connectionTimeout) {
  var self = this,
    listenerConnections = [],
    runnerConnections = [],
    connections = [];

  // create the express application
  var expressApp = express();

  // register the Listener directory for static content and redirect "/" to index.html
  expressApp.use(express.static('./src/Listener'));
  expressApp.get('/', function(req, res){
    res.redirect('/index.html');
  });
  
  // create the HTTP server
  var httpServer = http.createServer(expressApp);

  // if the connection timeout value is set then override the default
  if (connectionTimeout) {
    httpServer.on('connection', function(connection) {
      connection.setTimeout(connectionTimeout);
    });
  }

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
    connections.push(connection);
    connection.on('close', function() {
      var index = listenerConnections.indexOf(listenerConnection);
      listenerConnections.splice(index, 1);
      index = connections.indexOf(connection);
      connections.splice(index, 1);
    });
    self.emit('listener');
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
    runnerConnections.push(runnerConnection);
    connections.push(connection);
    connection.on('close', function() {
      var index = runnerConnections.indexOf(runnerConnection);
      runnerConnections.splice(index, 1);
      index = connections.indexOf(connection);
      connections.splice(index, 1);
    });
    self.emit('runner');
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
    // close the SockJS connections
    connections.forEach(function(connection) {
      connection.close();
    });
    httpServer.close(function() {
      self.emit('stopped');
    });
    return self;
  };
}
util.inherits(Server, events.EventEmitter);

module.exports = Server;
