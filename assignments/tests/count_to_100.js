var request = require('request');
var jsdom = require('jsdom');

// a function `countTo100` exists, and, when called, logs the numbers 1 through 100 sequentially to the console.

module.exports = {
	description: 'a function `countTo100` exists, and, when called, logs the numbers 1 through 100 sequentially to the console',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var virtualConsole = jsdom.createVirtualConsole();
				virtualConsole.on("log", function(message) {
					if (!this.previous && (message == 1)) {
						this.previous = 1;
					} else if ((this.previous == 99) && (message == 100)) {
						this.passed = true;
					} else if (message == (this.previous + 1)) {
						this.previous = message
					}
				}.bind(this));
				jsdom.env(body, {
					url: url,
					virtualConsole: virtualConsole,
					features: {
						FetchExternalResources: ["link", "css", "script"],
						ProcessExternalResources: ["script"]
					},
					done: function(error, window) {
						// shitty, terrible way to do this, but not much of an option here
						try {
							if (("countTo100" in window) && (typeof window.countTo100 == "function")) {
								window.countTo100();
								setTimeout(function() {
									if (!this.passed) {
										this.passed = false;
									}
									return cb(null, this);
								}, 1000);
							} else {
								this.passed = false;
								return cb(null, this);
							}
						} catch (e) {
							this.passed = false;
							return cb(null, this);
						}
					}.bind(this)
				});
			} else {
				this.passed = false;
				cb(null, this);
			}
		}.bind(this));
	}
};
