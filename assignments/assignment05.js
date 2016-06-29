// Client Project Show-and-Tell, Lab session

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = {
	description: "For this assignment, submit a link to your client's existing site or web presence. This just gives us an idea of who your client is, and what life was like before you came in blew their minds!\n\nIf they don't already have a site, just submit anything that you can find on them - Facebook, Twitter, Google Maps, anything that tells us a little bit about them.\n\nFor example, if I was doing some work for my friend Josh, I'd submit this:\n```submit 5 https://soundcloud.com/joshuaduchene```",
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
