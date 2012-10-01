var expect = require('chai').expect,
	mochaMock = require('./Mocha.mock');

describe('MochaMock', function() {
	it('should remember the options we initialise it with so that we can test them later', function() {
		var MochaMock = mochaMock();
		var mocha = new MochaMock({option: 'my option'});
		expect(mocha.options).to.deep.equal({option: 'my option'});
	});
	it('should remember the files we add so that we can check them later', function() {
		var MochaMock = mochaMock();
		var mocha = new MochaMock();
		mocha.addFile('banana');
		mocha.addFile('apple');
		mocha.addFile('pear');
		expect(mocha.files).to.deep.equal(['banana', 'apple', 'pear']);
	});
	it('should return a failure count of zero by default when run is called', function(done) {
		var MochaMock = mochaMock();
		var mocha = new MochaMock();
		mocha.run(function(failureCount) {
			expect(failureCount).to.equal(0);
			done();
		});
	});
	it('should return the failure count we previously specified when run is called', function(done) {
		var MochaMock = mochaMock(10);
		var mocha = new MochaMock();
		mocha.run(function(failureCount) {
			expect(failureCount).to.equal(10);
			done();
		});
	});
	it('should throw the error we previously specified when run is called', function(done) {
		var MochaMock = mochaMock(new Error('This is a test'));
		var mocha = new MochaMock();
		try {
			mocha.run(function(failureCount) {});
		} catch(error) {
			expect(error.toString()).to.equal((new Error('This is a test')).toString());
			done();
		}
	});
});