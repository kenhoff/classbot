// Portfolio Site Show-and-Tell, Lab session

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








// var request = require('request');
// var async = require('async');
// var jsdom = require("jsdom");
//
// // - an element with a `background-position`
// // - an element with a `background-size`
// // - an element with a `background-image`
// // - an element with `margin: auto`
// // - an element with `text-align: center`
// // - an element with `display: flex`
//
//
// module.exports = function(url, cb) {
// 	if (!url) {
// 		return cb("URL not found");
// 	}
// 	tests = [{
// 		description: "submitted URL was accessible from the internet",
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					this.passed = true;
// 					cb(null, this);
// 				} else {
// 					this.passed = false;
// 					cb(null, this);
// 				}
// 			}.bind(this));
// 		}
// 	}];
//
// 	backgroundStyles = ['background-position', 'background-size', 'background-image'];
//
// 	for (backgroundStyle of backgroundStyles) {
// 		tests.push({
// 			backgroundStyle: backgroundStyle,
// 			description: 'site has an element with a `' + backgroundStyle + '`',
// 			assert: function(url, cb) {
// 				request(url, function(error, response, body) {
// 					if (!error && response.statusCode == 200) {
// 						jsdom.env(body, {
// 							url: url,
// 							features: {
// 								FetchExternalResources: ["link", "css"]
// 							},
// 							done: function(err, window) {
// 								elements = window.document.getElementsByTagName('*');
// 								for (element of elements) {
// 									if (this.backgroundStyle in window.getComputedStyle(element)) {
// 										this.passed = true;
// 										return cb(null, this);
// 									}
// 								}
// 								this.passed = false;
// 								return cb(null, this);
// 							}.bind(this)
// 						});
// 					} else {
// 						this.passed = false;
// 						cb(null, this);
// 					}
// 				}.bind(this));
// 			}
// 		});
// 	}
//
// 	tests.push({
// 		description: 'site has an element with `margin: auto`',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('*');
// 							for (element of elements) {
// 								if (
// 									(window.getComputedStyle(element)["margin-top"] == "auto") &&
// 									(window.getComputedStyle(element)["margin-right"] == "auto") &&
// 									(window.getComputedStyle(element)["margin-bottom"] == "auto") &&
// 									(window.getComputedStyle(element)["margin-left"] == "auto")) {
// 									this.passed = true;
// 									return cb(null, this);
// 								}
// 							}
// 							this.passed = false;
// 							return cb(null, this);
// 						}.bind(this)
// 					});
// 				} else {
// 					this.passed = false;
// 					cb(null, this);
// 				}
// 			}.bind(this));
// 		}
// 	}, {
// 		description: 'site has an element with `text-align: center`',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('*');
// 							for (element of elements) {
// 								if (window.getComputedStyle(element)["text-align"] == "center") {
// 									this.passed = true;
// 									return cb(null, this);
// 								}
// 							}
// 							this.passed = false;
// 							return cb(null, this);
// 						}.bind(this)
// 					});
// 				} else {
// 					this.passed = false;
// 					cb(null, this);
// 				}
// 			}.bind(this));
// 		}
// 	}, {
// 		description: 'site has an element with `display: flex`',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('*');
// 							for (element of elements) {
// 								if (window.getComputedStyle(element)["display"] == "flex") {
// 									this.passed = true;
// 									return cb(null, this);
// 								}
// 							}
// 							this.passed = false;
// 							return cb(null, this);
// 						}.bind(this)
// 					});
// 				} else {
// 					this.passed = false;
// 					cb(null, this);
// 				}
// 			}.bind(this));
// 		}
// 	});
//
// 	async.map(tests, function(test, cb) {
// 		test.assert(url, cb);
// 	}, function(err, results) {
// 		for (test of tests) {
// 			delete test.assert;
// 		}
// 		scoreObject = {
// 			score: calculateScore(tests),
// 			tests: tests
// 		};
// 		return cb(null, scoreObject);
// 	});
// };
