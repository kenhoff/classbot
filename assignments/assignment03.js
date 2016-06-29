// CSS styles and selectors, external stylesheets

var calculateScore = require("../calculateScore.js");

var request = require('request');
var async = require('async');
var jsdom = require("jsdom");

var stylesRequired = ['color', 'background-color', 'font-style', 'font-family', 'font-size', 'width', 'height', ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], 'border-radius', 'border-width', 'border-style', ['margin-top', 'margin-bottom', 'margin-left', 'margin-right']];

module.exports = function(url, cb) {
	if (!url) {
		return cb("URL not found");
	}
	var tests = [{
		description: "submitted URL was accessible from the internet",
		assert: function(url, cb) {
			request(url, function(error, response) {
				if (!error && response.statusCode == 200) {
					this.passed = true;
					cb(null, this);
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	}];

	tests.push({
		description: 'site has an external style sheet (a `link` with `rel="stylesheet"` and an `href` to a valid `.css` file)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var elements = window.document.getElementsByTagName('*');
						async.detectSeries(elements, function(element, asyncCB) {
							if (element.tagName == "LINK") {
								if (element.getAttribute("rel") == "stylesheet") {
									if (element.getAttribute('href').startsWith("http")) {
										var newUrl = element.getAttribute('href');
									} else if (element.getAttribute('href').startsWith("/")) {
										var pathArray = url.split('/');
										var protocol = pathArray[0];
										var host = pathArray[2];
										var origin = protocol + '//' + host;
										newUrl = origin + element.getAttribute('href');
									} else {
										pathArray = url.split('/');
										pathArray.splice(-1, 1);
										newUrl = pathArray.join('/') + "/" + element.getAttribute('href');
									}
									// console.log(newUrl);
									request(newUrl, function(error, response) {
										if (!error && response.statusCode == 200) {
											asyncCB(true);
										} else {
											asyncCB(false);
										}
									});
								} else {
									asyncCB(false);
								}
							} else {
								asyncCB(false);
							}
						}, function(element) {
							if (element) {
								this.passed = true;
								return cb(null, this);
							} else {
								this.passed = false;
								return cb(null, this);
							}
						}.bind(this));
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	}, {
		description: 'site has a `div` with an `id` of `main-content`',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var elements = window.document.getElementsByTagName('div');
						for (var element of elements) {
							if (element.getAttribute("id") == "main-content") {
								this.passed = true;
								return cb(null, this);
							}
						}
						this.passed = false;
						return cb(null, this);
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	}, {
		description: 'site has a `div` with a `class` of `profile-section`',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var elements = window.document.getElementsByTagName('div');
						for (var element of elements) {
							if (element.getAttribute("class") == "profile-section") {
								this.passed = true;
								return cb(null, this);
							}
						}
						this.passed = false;
						return cb(null, this);
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	});

	for (var style of stylesRequired) {
		tests.push({
			style: style,
			description: 'site has an element that has a `' + (
				Array.isArray(style) ? style.join("` or `") : style
			) + '` assigned',
			assert: function(url, cb) {
				request(url, function(error, response) {
					if (!error && response.statusCode == 200) {
						jsdom.env({
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								// console.log(jsdom.serializeDocument(window.document))
								var elements = window.document.getElementsByTagName('*');
								for (var element of elements) {
									// if the style is an array (one of the array), do a different check
									if (Array.isArray(this.style)) {
										for (var testStyle of this.style) {
											if (window.getComputedStyle(element)[testStyle]) {
												this.passed = true;
												return cb(null, this);
											}
										}
									} else {
										// else, do a normal check
										// check the element's style to see if it's got the style we're testing for
										if (window.getComputedStyle(element)[this.style]) {
											this.passed = true;
											return cb(null, this);
										}
									}
								}
								this.passed = false;
								return cb(null, this);
							}.bind(this)
						});
					} else {
						this.passed = false;
						cb(null, this);
					}
				}.bind(this));
			}
		});
	}


	var backgroundStyles = ['background-position', 'background-size', 'background-image'];

	for (var backgroundStyle of backgroundStyles) {
		tests.push({
			backgroundStyle: backgroundStyle,
			description: 'site has an element with a `' + backgroundStyle + '`',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('*');
								for (var element of elements) {
									if (this.backgroundStyle in window.getComputedStyle(element)) {
										this.passed = true;
										return cb(null, this);
									}
								}
								this.passed = false;
								return cb(null, this);
							}.bind(this)
						});
					} else {
						this.passed = false;
						cb(null, this);
					}
				}.bind(this));
			}
		});
	}

	async.map(tests, function(test, cb) {
		test.assert(url, cb);
	}, function() {
		for (var test of tests) {
			delete test.assert;
		}
		var scoreObject = {
			score: calculateScore(tests),
			tests: tests
		};
		return cb(null, scoreObject);
	});
};
