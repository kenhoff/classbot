var request = require('request');
var jsdom = require('jsdom');

// create a function `sayHello` that takes one argument (or parameter) and, when called, logs `Hello, <name>!` to the console (e.g., calling `sayHello("Ken")` would log `Hello, Ken!` to the console)

module.exports = {
	description: 'a function `sayHello` exists, that takes one argument (parameter), and when called, logs `Hello, <name>!` to the console (e.g., calling `sayHello("Ken")` would log `Hello, Ken!` to the console)',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var virtualConsole = jsdom.createVirtualConsole();
				virtualConsole.on("log", function(message) {
					console.log(message);
					if (message == "Hello, Kirk!") {
						this.kirk = true;
					}
					if (message == "Hello, Spock!") {
						this.spock = true;
					}
					if (this.kirk && this.spock) {
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
						try {
							if (("helloWorld" in window) && (typeof window.helloWorld == "function")) {
								window.sayHello("Kirk");
								window.sayHello("Spock");
								setTimeout(() => {
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
				return cb(null, this);
			}
		}.bind(this));
	}
};
