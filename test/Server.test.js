/*global describe it before after beforeEach afterEach*/

var expect = require('chai').expect,
    Server = require('../src/Server'),
    request = require('superagent'),
    sockJSClient = require('sockjs-client');

var TEST_PORT = 8080;

describe('Server', function() {
  var server;

  before(function() {
    server = new Server(TEST_PORT);
  });

  it('should callback and emit events when started and stopped', function(done) {
    var startedEventsReceived = 0,
      stoppedEventsReceived = 0;
    server.start(function() {
      server.stop(function() {
        expect(startedEventsReceived).to.equal(1, 'Should get 1 and only 1 started event');
        expect(stoppedEventsReceived).to.equal(1, 'Should get 1 and only 1 stopped event');
        done();
      });
    }).on('started', function() {
      startedEventsReceived++;
    }).on('stopped', function() {
      stoppedEventsReceived++;
    });
  });

  describe('HTTP', function() {
    before(function(done) {
      server.start(done);
    });

    it('should return the TestListener.html page in response to GET requests for "/" on the port supplied at construction', function(done) {
      request.get('http://localhost:' + TEST_PORT + '/', function(response) {
        expect(response.status).to.equal(200);
        expect(response.type).to.equal('text/html');
        expect(response.text).to.match(/<!-- Listener marker -->/g);
        done();
      });
    });

    after(function(done) {
      server.stop(done);
    });
  });

  describe('SockJS', function() {
    var listenerSocket1,
      listenerSocket2,
      listenerSocket3,
      runnerSocket;

    beforeEach(function(done) {
      server.start(function() {
        listenerSocket1 = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
        listenerSocket1.on('connection', function() {
          listenerSocket2 = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
          listenerSocket2.on('connection', function() {
            listenerSocket3 = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
            listenerSocket3.on('connection', function() {
              runnerSocket = sockJSClient.create('http://localhost:' + TEST_PORT + '/Runner');
              runnerSocket.on('connection', function() {
                done();
              });
            });
          });
        });
      });
    });

    it('should forward tests sent to runner socket to the listener sockets', function(done) {
      var runCount = 0;
      listenerSocket1.on('data', function(data) {
        runCount++;
        expect(data).to.equal('tests');
        listenerSocket1.write('complete');
      });
      listenerSocket2.on('data', function(data) {
        runCount++;
        expect(data).to.equal('tests');
        listenerSocket2.write('complete');
      });
      listenerSocket3.on('data', function(data) {
        runCount++;
        expect(data).to.equal('tests');
        listenerSocket3.write('complete');
      });
      runnerSocket.on('data', function(data) {
        expect(data).to.equal('complete');
        expect(runCount).to.equal(3);
        done();
      });
      runnerSocket.write('tests');
    });

    afterEach(function(done) {
      runnerSocket.on('close', function() {
        listenerSocket1.on('close', function() {
          listenerSocket2.on('close', function() {
            listenerSocket3.on('close', function() {
              server.stop(done);
            });
            listenerSocket3.close();
          });
          listenerSocket2.close();
        });
        listenerSocket1.close();
      });
      runnerSocket.close();
    });
  });
});
