var request = require('request');
var jsdom = require('jsdom');

module.exports = {
	description: 'a function `hideAllSpoilers` exists, that, when called, finds all elements on the page with `class="spoiler"` and adds the class `hidden` to them',
	assert: function(url, cb) {
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var virtualConsole = jsdom.createVirtualConsole();
				jsdom.env(body, {
					url: url,
					virtualConsole: virtualConsole,
					features: {
						FetchExternalResources: ["link", "css", "script"],
						ProcessExternalResources: ["script"]
					},
					done: (error, window) => {
						this.passed = false;

						var newElement = window.document.createElement("div");
						newElement.className = "spoiler";

						if (("hideAllSpoilers" in window) && (typeof window.hideAllSpoilers == "function")) {
							try {
								window.hideAllSpoilers();
							} catch (e) {
								this.passed = false;
								return cb(null, this);
							}
							var spoilers = window.document.getElementsByClassName("spoiler");
							var allSpoilersHidden = true;
							for (var i = 0; i < spoilers.length; i++) {
								if (!spoilers[i].className.includes("hidden")) {
									allSpoilersHidden = false;
								}
							}
							if (allSpoilersHidden) {
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
