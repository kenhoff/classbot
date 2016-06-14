// CSS styles and selectors, external stylesheets

var request = require('request');
var async = require('async');
var jsdom = require("jsdom")
	// - an external style sheet <-- ignore this for now
	// - a `div` with an `id` of `main-content`
	// - a `div` with a `class` of `profile-section`
	// - an element with a `display` of `block` assigned using an *internal* style
	// - an element with a `display` of `inline` assigned using an *internal* style
	// - an element with a `display` of `inline-block` assigned using an *internal* style

stylesRequired = ['color', 'background-color', 'font-style', 'font-family', 'font-size', 'width', 'height', ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], 'border-color', 'border-radius', 'border-width', 'border-style', ['margin-top', 'margin-bottom', 'margin-left', 'margin-right']]

module.exports = function(url, cb) {
	if (!url) {
		return cb("URL not found")
	}
	tests = [{
		description: "submitted URL was accessible from the internet",
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					this.passed = true
					cb(null, this)
				} else {
					this.passed = false
					cb(null, this)
				}
			}.bind(this))
		}
	}]

	tests.push({
		description: 'site has an external style sheet (a `link` with `rel="stylesheet"` and an `href` to a valid `.css` file)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						elements = window.document.getElementsByTagName('*')
						async.detectSeries(elements, function(element, asyncCB) {
							if (element.tagName == "LINK") {
								if (element.getAttribute("rel") == "stylesheet") {
									if (element.getAttribute('href').startsWith("http")) {
										newUrl = element.getAttribute('href')
									} else if (element.getAttribute('href').startsWith("/")) {
										pathArray = url.split('/');
										protocol = pathArray[0];
										host = pathArray[2];
										origin = protocol + '//' + host;
										newUrl = origin + element.getAttribute('href')
									} else {
										pathArray = url.split('/');
										pathArray.splice(-1, 1)
										newUrl = pathArray.join('/') + "/" + element.getAttribute('href')
									}
									// console.log(newUrl);
									request(newUrl, function(error, response) {
										if (!error && response.statusCode == 200) {
											asyncCB(true)
										} else {
											asyncCB(false)
										}
									})
								} else {
									asyncCB(false)
								}
							} else {
								asyncCB(false)
							}
						}, function(element) {
							if (element) {
								this.passed = true
								return cb(null, this)
							} else {
								this.passed = false
								return cb(null, this)
							}
						}.bind(this))
					}.bind(this))
				} else {
					this.passed = false
					cb(null, this)
				}
			}.bind(this))
		}
	}, {
		description: 'site has a `div` with an `id` of `main-content`',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						elements = window.document.getElementsByTagName('div')
						for (element of elements) {
							if (element.getAttribute("id") == "main-content") {
								this.passed = true
								return cb(null, this)
							}
						}
						this.passed = false
						return cb(null, this)
					}.bind(this))
				} else {
					this.passed = false
					cb(null, this)
				}
			}.bind(this))
		}
	}, {
		description: 'site has a `div` with a `class` of `profile-section`',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						elements = window.document.getElementsByTagName('div')
						for (element of elements) {
							if (element.getAttribute("class") == "profile-section") {
								this.passed = true
								return cb(null, this)
							}
						}
						this.passed = false
						return cb(null, this)
					}.bind(this))
				} else {
					this.passed = false
					cb(null, this)
				}
			}.bind(this))
		}
	})

	displayTypes = ['block', 'inline', 'inline-block']

	for (displayType of displayTypes) {
		tests.push({
			displayType: displayType,
			description: 'site has an element with a `display` of `' + displayType + '` assigned',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								elements = window.document.getElementsByTagName('*')
								for (element of elements) {
									console.log(element.tagName);
									console.log(window.getComputedStyle(element).display);
									if (window.getComputedStyle(element).display == this.displayType) {
										this.passed = true
										return cb(null, this)
									}
								}
								this.passed = false
								return cb(null, this)
							}.bind(this)
						})
					} else {
						this.passed = false
						cb(null, this)
					}
				}.bind(this))
			}
		})
	}

	for (style of stylesRequired) {
		tests.push({
			style: style,
			description: 'site has an element that has a `' + (
				Array.isArray(style) ? style.join("` or `") : style
			) + '` assigned',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env({
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								// console.log(jsdom.serializeDocument(window.document))
								elements = window.document.getElementsByTagName('*')
								for (element of elements) {
									// if the style is an array (one of the array), do a different check
									if (Array.isArray(this.style)) {
										for (testStyle of this.style) {
											if (window.getComputedStyle(element)[testStyle]) {
												this.passed = true
												return cb(null, this)
											}
										}
									} else {
										// else, do a normal check
										// check the element's style to see if it's got the style we're testing for
										if (window.getComputedStyle(element)[this.style]) {
											this.passed = true
											return cb(null, this)
										}
									}
								}
								this.passed = false
								return cb(null, this)
							}.bind(this)
						})
					} else {
						this.passed = false
						cb(null, this)
					}
				}.bind(this))
			}
		})
	}

	async.map(tests, function(test, cb) {
		test.assert(url, cb)
	}, function(err, results) {
		for (test of tests) {
			delete test.assert
		}
		scoreObject = {
			score: calculateScore(tests),
			tests: tests
		}
		return cb(null, scoreObject)
	})
}
