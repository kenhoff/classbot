var request = require('request');
var jsdom = require('jsdom');
const sinon = require('sinon');

module.exports = {
	description: 'a function `getRandomKanyeQuote` exists, that, when called, makes a GET request using jQuery to `http://randomquote.hoff.tech/api/lists/kanyequotes/random`',
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
								var myStub = sinon.stub(window.$, "ajax");
							}
							if ("getRandomKanyeQuote" in window) {
								window.getRandomKanyeQuote();
							}
							if ((myStub.callCount >= 1) && myStub.calledWithMatch({
									url: "http://randomquote.hoff.tech/api/lists/kanyequotes/random",
									type: "get"
								})) {
								this.passed = true;
							} else {
								this.passed = false;
							}
							return cb(null, this);
						} catch (e) {
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
