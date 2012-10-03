var events = require('events'),
	util = require('util'),
	http = require('http'),
	fs = require('fs'),
	io = require('socket.io');

function Server(port) {
	var self = this;

	// create the http server
	var httpServer = http.createServer(function(request, response) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('./src/TestListener.html').pipe(response);
	});

	// attach the socket io instance to the http server
	var socket = io.listen(httpServer, {
		'log level': 0
	});

	this.start = function(callback) {
		self.once('started', callback);
		httpServer.listen(port, function() {
			self.emit('started');
		});
		return self;
	};

	this.stop = function(callback) {
		self.once('stopped', callback);
		httpServer.close(function() {
			self.emit('stopped');
		});
		return self;
	};
}
util.inherits(Server, events.EventEmitter);

module.exports = Server;