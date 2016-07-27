var request = require('request');
var jsdom = require('jsdom');

module.exports = {
	description: 'a function `changeToAsdf` exists, that, when called, finds the element on the page with `id="asdf"` and changes the `innerHTML` to `asdf`',
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
						var existingElement = window.document.getElementById("asdf");
						if (existingElement) {
							existingElement.innerHTML = "notasdf";
						} else {
							var newElement = window.document.createElement("div");
							newElement.id = "asdf";
							window.document.body.appendChild(newElement);
						}
						if (("changeToAsdf" in window) && (typeof window.changeToAsdf == "function")) {
							try {
								window.changeToAsdf();
							} catch (e) {
								this.passed = false;
								return cb(null, this);
							}
							if (window.document.getElementById("asdf").innerHTML == "asdf") {
								this.passed = true;
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
