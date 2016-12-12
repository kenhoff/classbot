var request = require('request');
var jsdom = require('jsdom');
const sinon = require('sinon');

module.exports = {
	description: 'a function `getRandomKanyeQuote` exists, that, when called, makes a GET request (with `method: "GET"` - using the method key, and "GET" in all caps) using jQuery to `https://randomquote.hoff.tech/api/lists/kanyequotes/random`',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				jsdom.env(body, {
					url: url,
					features: {
						FetchExternalResources: ["link", "css", "script"],
						ProcessExternalResources: ["script"]
					},
					done: (error, window) => {
						try {
							if ("$" in window) {
								var mySpy = sinon.spy(window.$, "ajax");
							}
							console.log(window.getRandomKanyeQuote);
							if ("getRandomKanyeQuote" in window) {
								window.getRandomKanyeQuote();
							}
							if ((mySpy.callCount >= 1) && mySpy.calledWithMatch({
									url: "https://randomquote.hoff.tech/api/lists/kanyequotes/random",
									method: "GET"
								})) {
								this.passed = true;
							} else {
								this.passed = false;
							}
							console.log(mySpy.callCount);
							console.log(mySpy.firstCall.args);
							return cb(null, this);
						} catch (e) {
							console.log(e);
							this.passed = false;
							return cb(null, this);
						}
					}
				});
			} else {
				this.passed = false;
				cb(null, this);
			}
		}.bind(this));
	}
};
