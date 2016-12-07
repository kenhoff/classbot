var request = require('request');
var jsdom = require('jsdom');

// create a function `helloWorld` that, when called, logs the string `Hello, World!` to the console.

module.exports = {
	description: 'a function `helloWorld` exists, that, when called, logs the string `Hello, World!` to the console',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var virtualConsole = jsdom.createVirtualConsole();
				virtualConsole.on("log", function(message) {
					if (message == "Hello, World!") {
						this.passed = true;
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
						if (("helloWorld" in window) && (typeof window.helloWorld == "function")) {
							window.helloWorld();
							setTimeout(() => {
								if (!this.passed) {
									this.passed = false;
								}
								console.log(this);
								return cb(null, this);
							}, 1000);
						} else {
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
