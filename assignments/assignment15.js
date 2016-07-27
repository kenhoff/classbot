// jQuery 201: including jQuery on your site

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

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




// , {
// 	description: "include jQuery",
// 	assert: function(url, cb) {
// 		request(url, function(error, response, body) {
// 			if (!error && response.statusCode == 200) {
// 				jsdom.env(body, {
// 					url: url,
// 					features: {
// 						FetchExternalResources: ["link", "css", "script"],
// 						ProcessExternalResources: ["script"]
// 					},
// 					done: function(err, window) {
// 						if (typeof window.$ == "function") {
// 							this.passed = true;
// 						} else {
// 							this.passed = false;
// 						}
// 						return cb(null, this);
// 					}.bind(this)
// 				});
// 			} else {
// 				this.passed = false;
// 				cb(null, this);
// 			}
// 		}.bind(this));
// 	}
// }, {
// 	description: "include a function `showSpoiler` that uses jQuery to show all elements with the `spoiler` class",
// 	assert: function(url, cb) {
// 		request(url, function(error, response, body) {
// 			if (!error && response.statusCode == 200) {
// 				jsdom.env(body, {
// 					url: url,
// 					features: {
// 						FetchExternalResources: ["link", "css", "script"],
// 						ProcessExternalResources: ["script"]
// 					},
// 					done: function(err, window) {
// 						try {
// 							var show = sinon.spy();
// 							sinon.stub(window, "$");
// 							window.$.withArgs(".spoiler").returns({
// 								show: show
// 							});
// 							window.showSpoiler();
// 							assert(show.callCount >= 1);
// 							this.passed = true;
// 						} catch (e) {
// 							this.passed = false;
// 						}
// 						return cb(null, this);
// 					}.bind(this)
// 				});
// 			} else {
// 				this.passed = false;
// 				cb(null, this);
// 			}
// 		}.bind(this));
// 	}
// }, {
// 	description: "include a function `hideSpoiler` that uses jQuery to hide all elements with the `spoiler` class",
// 	assert: function(url, cb) {
// 		request(url, function(error, response, body) {
// 			if (!error && response.statusCode == 200) {
// 				jsdom.env(body, {
// 					url: url,
// 					features: {
// 						FetchExternalResources: ["link", "css", "script"],
// 						ProcessExternalResources: ["script"]
// 					},
// 					done: function(err, window) {
// 						try {
// 							var hide = sinon.spy();
// 							sinon.stub(window, "$");
// 							window.$.withArgs(".spoiler").returns({
// 								hide: hide
// 							});
// 							window.hideSpoiler();
// 							assert(hide.callCount >= 1);
// 							this.passed = true;
// 						} catch (e) {
// 							this.passed = false;
// 						}
// 						return cb(null, this);
// 					}.bind(this)
// 				});
// 			} else {
// 				this.passed = false;
// 				cb(null, this);
// 			}
// 		}.bind(this));
// 	}
// }
