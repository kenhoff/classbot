var request = require('request');
var jsdom = require('jsdom');

module.exports = {
	description: 'a function `getAllRightAlignedParagraphTags` exists, that, when called, returns all paragraph tags with a class of `rightAligned`',
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
						this.passed = false;
						var newElement = window.document.createElement("p");
						newElement.className = "rightAligned";
						window.document.body.appendChild(newElement);
						if (("getAllRightAlignedParagraphTags" in window) && (typeof window.getAllRightAlignedParagraphTags == "function")) {
							try {
								var results = window.getAllRightAlignedParagraphTags();
							} catch (e) {
								this.passed = false;
								return cb(null, this);
							}
							var allResultsCorrect = true;
							if (!(Array.isArray(results)) || (results.length == 0)) {
								this.passed = false;
								return cb(null, this);
							}
							for (var result of results) {
								if (!result.className.includes("rightAligned") || (result.tagName != "P")) {
									allResultsCorrect = false;
									break;
								}
							}
							if (allResultsCorrect) {
								this.passed = true;
							} else {
								this.passed = false;
							}
						}
						return cb(null, this);
					}
				});
			} else {
				this.passed = false;
				cb(null, this);
			}
		}.bind(this));
	}
};
