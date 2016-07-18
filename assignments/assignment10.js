// Javascript 101: the `<script>` tag

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');
var jsdom = require('jsdom');
var sinon = require('sinon');

module.exports = {
	description: "For this assignment, I'd like for you to create a page with some `<script>` tags on it! You'll include some `alert()` and `console.log()` commands on there too. See what you need by running `submit 10 http://your-site-here.firebaseapp.com`.\n\n_Note: I haven't included any requirements to `document.write()` anything on your page (it's surprisingly hard to check for that!) but I'd recommend that you do it anyway._",
	test: function(url, cb) {
		if (!url) {
			return cb("URL not found");
		}
		var tests = [{
			description: "submitted URL was accessible from the internet",
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						this.passed = true;
						cb(null, this);
					} else {
						this.passed = false;
						cb(null, this);
					}
				}.bind(this));
			}
		}, {
			description: 'a `<script>` tag in the `<head>` section with some internal JavaScript (e.g. no `src`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var headTags = window.document.getElementsByTagName('head');
								if (headTags.length != 0) {
									var scriptTags = headTags[0].getElementsByTagName("script");
									for (var scriptTag of scriptTags) {
										// if scriptTag has no src
										if (!("src" in scriptTag.attributes)) {
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
		}, {
			description: 'a `<script>` tag in the `<head>` section that references a valid JavaScript file (e.g. using `src`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var headTags = window.document.getElementsByTagName('head');
								if (headTags.length != 0) {
									var scriptTags = headTags[0].getElementsByTagName("script");
									for (var scriptTag of scriptTags) {
										// if scriptTag has no src
										if ("src" in scriptTag.attributes) {
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
		}, {
			description: 'a `<script>` tag as the _last element_ of the `<body>`',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var bodyTags = window.document.getElementsByTagName('body');
								if ((bodyTags.length != 0) && (bodyTags[0].childElementCount != 0)) {
									if (bodyTags[0].lastElementChild.tagName == "SCRIPT") {
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
		}, {
			description: '`console.log()` something',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var virtualConsole = jsdom.createVirtualConsole();
						virtualConsole.on("log", function() {
							this.passed = true;
						}.bind(this));
						jsdom.env(body, {
							url: url,
							virtualConsole: virtualConsole,
							features: {
								FetchExternalResources: ["link", "css", "script"],
								ProcessExternalResources: ["script"]
							},
							done: function() {
								if (!this.passed) {
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
		}, {
			description: '`alert()` something',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						var alertSpy;
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css", "script"],
								ProcessExternalResources: ["script"]
							},
							created: function(err, window) {
								alertSpy = sinon.spy(window, "alert");
							},
							done: function() {
								console.log("alert call count:", alertSpy.callCount);
								if (alertSpy.callCount > 0) {
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
		}];

		async.map(tests, function(test, cb) {
			test.assert(url, cb);
		}, function(err, results) {
			for (var test of tests) {
				delete test.assert;
			}
			var scoreObject = {
				score: calculateScore(tests),
				tests: tests,
				url: url
			};
			return cb(null, scoreObject);
		});
	}
};
