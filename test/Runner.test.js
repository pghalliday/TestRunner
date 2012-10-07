/*global describe it before*/

var expect = require('chai').expect;
var Runner = require('../src/Runner/Runner');

describe('Runner', function() {
  var runner;
  var files = ['./samples/test1.js', './samples/test2.js'];

  before(function() {
    runner = new Runner(files);
  });

  describe('#run', function() {
    it('should report success when run without tests', function(done) {
      runner.run(function(result) {
        expect(result).to.equal(true);
        done();
      });
    });

    it('should emit events that tells me when it has started, run a test and ended', function(done) {
      var startEventsReceived = 0;
      var endEventsReceived = 0;
      var fileEventsReceived = 0;
      runner.run(function(result) {
        expect(startEventsReceived).to.equal(1, 'Should see the start event once and only one');
        expect(endEventsReceived).to.equal(1, 'Should see the finish event once and only once');
        expect(fileEventsReceived).to.equal(2, 'Should see the file event twice');
        done();
      }).on('start', function() {
        startEventsReceived++;
      }).on('file', function(file) {
        expect(file).to.equal(files[fileEventsReceived], 'Should run the files in the order they are listed in the array');
        fileEventsReceived++;
      }).on('finish', function() {
        endEventsReceived++;
      });
    });
  });
});
