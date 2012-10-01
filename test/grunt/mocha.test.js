var proxyquire = require('proxyquire'),
	mochaMock = require('./mocks/Mocha.mock'),
	ModuleMock = require('./mocks/Module.mock'),
	GruntMock = require('./mocks/Grunt.mock'),
	expect = require('chai').expect;

describe('mocha grunt task', function(){
	it('should register a multi task', function() {
		var MochaTask = require('../../src/grunt/mocha.js');
		var grunt = new GruntMock();
		var mochaTask = new MochaTask(grunt);
		expect(grunt.multiTask.name).to.equal('mocha');
		expect(grunt.multiTask.description).to.equal('Run node unit tests with Mocha');
		expect(grunt.multiTask.callback).to.be.a('function');
	});

	it('should run asynchronously', function(done) {
		var MochaTask = proxyquire
			.noCallThru()
			.resolve('../../src/grunt/mocha.js', __dirname, {
				'mocha': mochaMock(),
				'module': new ModuleMock()
			});
		var grunt = new GruntMock();
		var mochaTask = new MochaTask(grunt);
		grunt.multiTask.run(function(success) {
			expect(success).to.equal(true);
			expect(grunt.multiTask.asynchronous).to.equal(true);
		});
	});

	it('should clear the require cache before sending tests to mocha so that it can be run from a watch task', function(done) {
		// TODO
		done();
	});

	it('should load mocha options from mochaConfig', function(done) {
		// TODO
		done();
	});

	it('should use named config where available', function(done) {
		// TODO
		done();
	});

	it('should expand and add the this.file.src file list to files in Mocha', function(done) {
		// TODO
		done();
	});

	it('should catch and log exceptions thrown by Mocha to the console before failing the task so that it can be run from a watch task', function(done) {
		// TODO
		done();
	});

	it('should fail if any tests fail', function(done) {
		// TODO
		done();
	});

	it('should succeed if no tests fail', function(done) {
		// TODO
		done();
	});
});