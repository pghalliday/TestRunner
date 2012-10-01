var expect = require('chai').expect,
	GruntMock = require('./Grunt.mock');

describe('GruntMock', function() {
	it('should remember the name, description and callback of last multi task registered so that we can check them later', function() {
		var grunt = new GruntMock();
		var callback = function() {};
		grunt.registerMultiTask('test', 'description', callback);
		expect(grunt.multiTask.name).to.equal('test');
		expect(grunt.multiTask.description).to.equal('description');
		expect(grunt.multiTask.callback).to.equal(callback);
	});
	it('should call the callback when the multitask is run', function(done) {
		var grunt = new GruntMock();
		var callback = function() {
			return true;
		};
		grunt.registerMultiTask('test', 'description', callback);
		grunt.multiTask.run(function(success) {			
			expect(success).to.equal(true);
			expect(grunt.multiTask.asynchronous).to.equal(false);
			done();
		});
	});
	it('should support asynchronous tasks', function(done) {
		var grunt = new GruntMock();
		var callback = function() {
			var complete = this.async();
			complete(true);
		};
		grunt.registerMultiTask('test', 'description', callback);
		grunt.multiTask.run(function(success) {
			expect(success).to.equal(true);
			expect(grunt.multiTask.asynchronous).to.equal(true);
			done();
		});
	});
	it('should support the config method', function() {
		var grunt = new GruntMock();
		expect(grunt.config()).to.equal(null);
	});
});