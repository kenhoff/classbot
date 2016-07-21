var request = require('request');
var jsdom = require('jsdom');

// set a variable named 'myString' to "asdfasdfasdf"

module.exports = {
	description: 'a variable named `myString` is equal to "asdfasdfasdf"',
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
						if (window.myString == "asdfasdfasdf") {
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
