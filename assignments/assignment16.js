// jQuery 202: `$`, using jQuery selectors and methods

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');
var names = ["kirk", "spock", "bones", "uhura", "sulu", "chekov", "scotty"];
module.exports = function(url, cb) {
	if (!url) {
		return cb("URL not found");
	}
	var tests = [{
		description: "server responds to the root URL",
		assert: function(url, cb) {
			request(url, function(error, response) {
				if (!error && response.statusCode == 200) {
					// console.log(response.body);
					this.passed = true;
					cb(null, this);
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	}];
	for (var name of names) {
		tests.push({
			name: name,
			description: "a request to `/hello/" + name + "` returns " + '`Hello, ' + name + "!`",
			assert: function(url, cb) {
				request(url + "/hello/" + this.name, function(error, response) {
					if (!error && response.statusCode == 200) {
						if (response.body == "Hello, " + this.name + "!") {
							this.passed = true;
							cb(null, this);
						} else {
							this.passed = false;
							cb(null, this);
						}
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
			tests: tests,
			url: url
		};
		return cb(null, scoreObject);
	});
};





// , , {
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
