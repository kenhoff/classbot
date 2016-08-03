const request = require('request');
const jsdom = require('jsdom');

module.exports = {
	description: "include jQuery on the site (using something like `<script src=\"https://code.jquery.com/jquery-2.2.4.js\"></script>`)",
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				jsdom.env(body, {
					url: url,
					features: {
						FetchExternalResources: ["link", "css", "script"],
						ProcessExternalResources: ["script"]
					},
					done: function(err, window) {
						if (typeof window.$ == "function") {
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
