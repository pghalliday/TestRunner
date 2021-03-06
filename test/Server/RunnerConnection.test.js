/*global describe it*/

var expect = require('chai').expect;
var RunnerConnection = require('../../src/Server/RunnerConnection');
var ListenerConnection = require('../../src/Server/ListenerConnection');

describe('RunnerConnection', function() {
  it('should forward tests to listener connections and emit complete only after all listeners have notified that the tests are complete', function(done) {
    var runCount = 0,
      listenerConnection1 = new ListenerConnection(),
      listenerConnection2 = new ListenerConnection(),
      listenerConnection3 = new ListenerConnection(),
      runnerConnection = new RunnerConnection([listenerConnection1, listenerConnection2, listenerConnection3]);
      
    listenerConnection1.on('data', function(data) {
      runCount++;
      expect(data).to.equal('tests');
      listenerConnection1.write('complete');
    }); 
    listenerConnection2.on('data', function(data) {
      runCount++;
      expect(data).to.equal('tests');
      listenerConnection2.write('complete');
    }); 
    listenerConnection3.on('data', function(data) {
      runCount++;
      expect(data).to.equal('tests');
      listenerConnection3.write('complete');
    });
    runnerConnection.on('data', function(data) {
      expect(data).to.equal('complete');
      expect(runCount).to.equal(3);
      done();
    });
    runnerConnection.write('tests');
  });
});
