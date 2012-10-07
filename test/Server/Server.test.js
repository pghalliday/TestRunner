/*global describe it before after beforeEach afterEach*/

var expect = require('chai').expect,
    Server = require('../../src/Server/Server'),
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

    it('should return the Listener/index.html page in response to GET requests for "/" on the port supplied at construction', function(done) {
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
    before(function(done) {
      server.start(done);
    });

    it('should emit an event when a listener connects', function(done) {
      var onConnectCount = 0;
      var onConnect = function() {
        onConnectCount++;
      };
      server.on('listener', onConnect);
      var listenerSocket = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
      listenerSocket.on('connection', function() {
        listenerSocket.on('close', function() {
          expect(onConnectCount).to.equal(1);
          server.removeListener('listener', onConnect);
          done();
        });
        listenerSocket.close();
      });
    });

    it('should emit an event when a runner connects', function(done) {
      var onConnectCount = 0;
      var onConnect = function() {
        onConnectCount++;
      };
      server.on('runner', onConnect);
      var runnerSocket = sockJSClient.create('http://localhost:' + TEST_PORT + '/Runner');
      runnerSocket.on('connection', function() {
        runnerSocket.on('close', function() {
          expect(onConnectCount).to.equal(1);
          server.removeListener('runner', onConnect);
          done();
        });
        runnerSocket.close();
      });
    });

    it('should forward tests sent to runner socket to the listener sockets', function(done) {
      var listenerSocket1,
        listenerSocket2,
        listenerSocket3,
        runnerSocket,
        runCount = 0;
        
      listenerSocket1 = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
      listenerSocket1.on('connection', function() {
        listenerSocket2 = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
        listenerSocket2.on('connection', function() {
          listenerSocket3 = sockJSClient.create('http://localhost:' + TEST_PORT + '/Listener');
          listenerSocket3.on('connection', function() {
            runnerSocket = sockJSClient.create('http://localhost:' + TEST_PORT + '/Runner');
            runnerSocket.on('connection', function() {
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
                runnerSocket.on('close', function() {
                  listenerSocket1.on('close', function() {
                    listenerSocket2.on('close', function() {
                      listenerSocket3.on('close', function() {
                        done();
                      });
                      listenerSocket3.close();
                    });
                    listenerSocket2.close();
                  });
                  listenerSocket1.close();
                });
                runnerSocket.close();
              });
              runnerSocket.write('tests');
            });
          });
        });
      });
    });

    after(function(done) {
      server.stop(done);
    });
  });
});
