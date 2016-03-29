var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');
var jsdom = require('jsdom');
var assert = require('assert');




// For this assignment, you'll use `console.log()` to log some variables, and you'll create an `addTwoNumbers` function that the `grader` can call.
//
// Your site needs to:
//
// - `console.log()` a number
// - `console.log()` a string
// - `console.log()` an array `[1, "two", "3"]`
// - `console.log()` an object `{whoa:{dude:'sweet'}}
// - `console.log()` the numbers 1 through 100, in order
// - create an `addTwoNumbers` function that takes two arguments `(a, b)` and returns the sum of those two arguments

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
	}, {
		description: '`console.log()` a number',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var virtualConsole = jsdom.createVirtualConsole();
					virtualConsole.on("log", function(message) {
						if (typeof message == "number") {
							this.passed = true;
						}
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
		description: '`console.log()` a string',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var virtualConsole = jsdom.createVirtualConsole();
					virtualConsole.on("log", function(message) {
						if (typeof message == "string") {
							this.passed = true;
						}
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
		description: '`console.log()` an array `[1, "two", "3"]`',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var virtualConsole = jsdom.createVirtualConsole();
					this.passed = false;
					virtualConsole.on("log", function(message) {
						if (Array.isArray(message)) {
							var arrayToCheck = [1, "two", "3"];
							if (message.length == arrayToCheck.length) {
								this.passed = true;
								for (var i = 0; i < message.length; i++) {
									if (message[i] !== arrayToCheck[i]) {
										this.passed = false;
										break;
									}
								}
							}
						}
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
		description: "`console.log()` an object `{whoa:{dude:'sweet'}}`",
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var virtualConsole = jsdom.createVirtualConsole();
					this.passed = false;
					virtualConsole.on("log", function(message) {
						if (JSON.stringify(message) == JSON.stringify({
								whoa: {
									dude: 'sweet'
								}
							})) {
							this.passed = true;
						}
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
		description: "`console.log()` the numbers 1 through 100, in order",
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var virtualConsole = jsdom.createVirtualConsole();
					this.passed = false;
					var count = 1;
					virtualConsole.on("log", function(message) {
						if (message == count) {
							count += 1;
						}
						if (count == 101) {
							this.passed = true;
						}
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
		description: "create an `addTwoNumbers` function that takes two arguments `(a, b)` and returns the sum of those two arguments",
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, {
						url: url,
						features: {
							FetchExternalResources: ["link", "css", "script"],
							ProcessExternalResources: ["script"]
						},
						done: function(err, window) {
							try {
								assert(typeof window.addTwoNumbers == "function");
								assert(window.addTwoNumbers(1, 2) == 3);
								assert(window.addTwoNumbers(100, 200) == 300);
								this.passed = true;
							} catch (e) {
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
	}, function() {
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
};
