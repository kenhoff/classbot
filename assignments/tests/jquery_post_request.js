var request = require('request');
var jsdom = require('jsdom');
const sinon = require('sinon');

module.exports = {
	description: "a function `postNewKanyeQuote` exists, that, when called, makes a POST request using jQuery to `http://randomquote.hoff.tech/api/lists/kanyequotes` (it doesn't matter what quote you submit)",
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
							if ("postNewKanyeQuote" in window) {
								window.postNewKanyeQuote();
							}
							if ((myStub.callCount >= 1) && myStub.calledWithMatch({
									url: "http://randomquote.hoff.tech/api/lists/kanyequotes",
									type: "post"
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
