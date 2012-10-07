var util = require('util');
var stream = require('stream');

function RunnerConnection(listenerConnections) {
  var self = this;
  
  self.readable = true;
  self.writable = true;
  stream.Stream.call(self);
  
  self.write = function(data) {
    var completeCount = 0,
      listenerCount = listenerConnections.length,
      result = 'complete';
    
    listenerConnections.forEach(function(listenerConnection) {
      listenerConnection.forwardTests(data, function(error) {
        completeCount++;
        if (error) {
          result = 'error';
        }
        if (completeCount === listenerCount) {
          self.emit('data', result);
        }
      });
    }); 
  };
  
  self.end = function(data) {
    self.write(data);
    self.emit('end');
  };
}
util.inherits(RunnerConnection, stream.Stream);

module.exports = RunnerConnection;