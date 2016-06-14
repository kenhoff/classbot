// CSS layouts, the `display` style, flexbox & media queries

var request = require('request');
var async = require('async');
var jsdom = require("jsdom")

// - the standard Bootstrap CSS from bootstrapcdn.com
// - the standard Bootstrap Theme CSS from bootstrapcdn.com
// - jQuery from the googleapis.com CDN
// - the standard Bootstrap Javascript script from bootstrapcdn.com
// - a `.container` element
// - a `.row` element
// - a `.col-xs-*` element
// - a `.col-sm-*` element
// - a `.col-md-*` element
// - a `.col-lg-*` element

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
	}, {
		description: 'site has the standard Bootstrap CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, {
						url: url,
						features: {
							FetchExternalResources: ["link", "css"]
						},
						done: function(err, window) {
							elements = window.document.getElementsByTagName('link')
							for (element of elements) {
								if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css") {
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
	}, {
		description: 'site has the standard Bootstrap Theme CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, {
						url: url,
						features: {
							FetchExternalResources: ["link", "css"]
						},
						done: function(err, window) {
							elements = window.document.getElementsByTagName('link')
							for (element of elements) {
								if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css") {
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
	}, {
		description: 'site has jQuery from googleapis.com (a `script` with `src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, {
						url: url,
						features: {
							FetchExternalResources: ["link", "css"]
						},
						done: function(err, window) {
							elements = window.document.getElementsByTagName('script')
							for (element of elements) {
								if (element.getAttribute("src") == "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js") {
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
	}, {
		description: 'the standard Bootstrap Javascript script from bootstrapcdn.com (a `script` with `src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, {
						url: url,
						features: {
							FetchExternalResources: ["link", "css"]
						},
						done: function(err, window) {
							elements = window.document.getElementsByTagName('script')
							for (element of elements) {
								if (element.getAttribute("src") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js") {
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
	}]

	classes = ["container", "row", "col-xs-", "col-sm-", "col-md-", "col-lg-"]

	for (bootstrapClass of classes) {
		tests.push({
			bootstrapClass: bootstrapClass,
			description: 'a `div` with class `' + (bootstrapClass.endsWith("-") ? bootstrapClass + "*" : bootstrapClass) + "`",
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								elements = window.document.getElementsByTagName('div')
								for (element of elements) {
									if (element.getAttribute("class") && element.getAttribute("class").includes(this.bootstrapClass)) {
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
