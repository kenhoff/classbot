var request = require('request');
var jsdom = require('jsdom');

// a function isThisPersonOld exists that takes a number as its only argument (parameter). if that number is greater than or equal to 27, returns `Wow, you're old!`. if that number is less than 27, return `Nope! Not old.`.

module.exports = {
	description: "a function isThisPersonOld exists that takes a number as its only argument (parameter). if that number is greater than or equal to 27, returns `Wow, you're old!`. if that number is less than 27, return `Nope! Not old.`.",
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
							if (("isThisPersonOld" in window) && (typeof window.isThisPersonOld == "function") && (window.isThisPersonOld(27) == "Wow, you're old!") && window.isThisPersonOld(26) == "Nope! Not old.") {
								this.passed = true;
							} else {
								this.passed = false;
							}
							return cb(null, this);
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
