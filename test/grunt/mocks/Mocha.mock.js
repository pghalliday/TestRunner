module.exports = function(result) {
	return function(options) {
		this.options = options;
		this.files = [];
		this.addFile = function(file) {
			this.files.push(file);
		};
		this.run = function(callback) {
			if (result instanceof Error) {
				throw result;
			} else if (typeof result === 'number') {
				callback(result);
			} else {
				callback(0);
			}
		};
	};
};
