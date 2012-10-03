/*global describe:false it:false*/

var should = require('chai').should();
var Runner = require('../src/Runner');

describe('Runner', function() {
	var runner;
	var files = ['./samples/test1.js', './samples/test2.js'];

	before(function() {
		runner = new Runner(files);
	});

	describe('#run', function() {
		it('should report success when run without tests', function(done) {
			runner.run(function(result) {
				result.should.be.true;
				done();
			});
		});

		it('should emit events that tells me when it has started, run a test and ended', function(done) {
			var startEventsReceived = 0;
			var endEventsReceived = 0;
			var fileEventsReceived = 0;
			runner.run(function(result) {
				startEventsReceived.should.equal(1, 'Should see the start event once and only one');
				endEventsReceived.should.equal(1, 'Should see the finish event once and only once');
				fileEventsReceived.should.equal(2, 'Should see the file event twice');
				done();
			}).on('start', function() {
				startEventsReceived++;
			}).on('file', function(file) {
				file.should.equal(files[fileEventsReceived], 'Should run the files in the order they are listed in the array');
				fileEventsReceived++;
			}).on('finish', function() {
				endEventsReceived++;
			});
		});
	})
});