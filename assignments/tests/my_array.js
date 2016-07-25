var request = require('request');
var jsdom = require('jsdom');

module.exports = {
	description: 'an array `myArray` exists that has the contents `[1, "two", "3"]`',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				this.passed = false;
				jsdom.env(body, {
					url: url,
					features: {
						FetchExternalResources: ["link", "css", "script"],
						ProcessExternalResources: ["script"]
					},
					done: function(err, window) {
						if ("myArray" in window && Array.isArray(window.myArray)) {
							var arrayToCheck = [1, "two", "3"];
							if (window.myArray.length == arrayToCheck.length) {
								this.passed = true;
								for (var i = 0; i < window.myArray.length; i++) {
									if (window.myArray[i] !== arrayToCheck[i]) {
										this.passed = false;
										break;
									}
								}
							}
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
