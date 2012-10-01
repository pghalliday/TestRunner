module.exports = function() {
	this.multiTask = {
		asynchronous: false,
		async: function() {
			this.asynchronous = true;
			var complete = this.complete;
			return function(success) {
				complete(success);
			};
		},
		run: function(complete) {
			this.complete = complete;
			var success = this.callback();
			if (!this.asynchronous) {
				complete(success);
			}
		}
	};
	this.registerMultiTask = function(name, description, callback) {
		this.multiTask.name = name;
		this.multiTask.description = description;
		this.multiTask.callback = callback;
	};
	this.config = function() {
		return null;
	};
};