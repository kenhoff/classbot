var request = require('request');
var jsdom = require('jsdom');

// set a variable named 'myNumber' to 100


module.exports = {
	description: "a variable named `myNumber` is equal to 100 (the number, not a string)",
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
						if (window.myNumber == 100) {
							this.passed = true;
						} else {
							this.passed = false;
						}
						return cb(null, this);
					}.bind(this)
				});
			} else {
				this.passed = false;
				cb(null, this);
			}
		}.bind(this));
	}
};
