var request = require('request');
var jsdom = require('jsdom');

// create a function `createHelloString` that takes one argument (or parameter) and, when called, *returns* a string `Hello, <name>!` (e.g. `console.log(createHelloString("Ken"))` would log `Hello, Ken!` to the console)

module.exports = {
	description: 'a function `createHelloString` exists, that takes one argument (parameter), and when called, *returns* a string `Hello, <name>!` (e.g. `console.log(createHelloString("Ken"))` would log `Hello, Ken!` to the console)',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				jsdom.env(body, {
					url: url,
					features: {
						FetchExternalResources: ["link", "css", "script"],
						ProcessExternalResources: ["script"]
					},
					done: function(error, window) {
						try {
							if (("createHelloString" in window) && (typeof window.createHelloString == "function") && (window.createHelloString("Kirk") == "Hello, Kirk!") && (window.createHelloString("Spock") == "Hello, Spock!")) {
								this.passed = true;
							} else {
								this.passed = false;
							}
						} catch (e) {
							this.passed = false;
						} finally {
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
