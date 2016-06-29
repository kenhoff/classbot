// Prebuilt & Customizable themes

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = {
	description: "Hopefully you took a look at the readings for this assignment!\n\nThis one's an easy one. Just submit a link to your favorite theme at https://html5up.net/!",
	test: function(url, cb) {
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
			description: "URL should be a link to your favorite theme at <https://html5up.net/>",
			assert: function(url, cb) {
				if (url.match(/https:\/\/html5up\.net\/(.+)/)) {
					this.passed = true;
					cb(null, this);
				} else {
					this.passed = false;
					cb(null, this);
				}
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
	}
};
