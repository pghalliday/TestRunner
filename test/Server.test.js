/*global describe:false it:false*/

var should = require('chai').should(),
	Server = require('../src/Server'),
	request = require('superagent')
	io = require('socket.io-client');

var TEST_PORT = 8080;

describe('Server', function() {
	var server;

	before(function() {
		server = new Server(TEST_PORT);
	});

	it('should callback and emit events when started and stopped', function(done) {
		var startedEventsReceived = 0;
		var stoppedEventsReceived = 0;
		server.start(function() {
			server.stop(function() {
				startedEventsReceived.should.equal(1, 'Should get 1 and only 1 started event');
				stoppedEventsReceived.should.equal(1, 'Should get 1 and only 1 stopped event');
				done();
			});
		}).on('started', function() {
			startedEventsReceived++;
		}).on('stopped', function() {
			stoppedEventsReceived++;
		});
	});

	describe('HTTP interface', function() {
		before(function(done) {
			server.start(done);
		});

		it('should return the TestListener.html page in response to GET requests for "/" on the port supplied at construction', function(done) {
			request.get('http://localhost:' + TEST_PORT + '/', function(response) {
				response.status.should.equal(200);
				response.type.should.equal('text/html');
				response.text.should.match(/<!-- TestListener marker -->/g);
				done();
			});
		});

		after(function(done) {
			server.stop(done);
		});
	});

	describe('Socket.IO interface', function() {
		before(function(done) {
			server.start(done);
		});

		it('should accept connections on the port supplied at construction', function(done) {
			var socket = io.connect('http://localhost:' + TEST_PORT);
			socket.on('connect', function() {
				socket.disconnect();
				done();
			});
		});

		after(function(done) {
			server.stop(done);
		});
	});
});