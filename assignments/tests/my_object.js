var jsdom = require('jsdom');
var request = require('request');

// var myObject = {
// 	dude: "sweet!",
// 	whoa: {
// 		nested: "object"
// 	}
// };

module.exports = {
	description: "an object `myObject` exists that has the contents `{dude: \"sweet!\",whoa: {nested: \"object\"}}`",
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
						if (("myObject" in window) && (JSON.stringify(window.myObject) == JSON.stringify({
								dude: "sweet!",
								whoa: {
									nested: "object"
								}
							}))) {
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
