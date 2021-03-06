// Command Line, Hosting your site on Firebase

var calculateScore = require("../calculateScore.js");
var request = require('request');
var async = require('async');

module.exports = {
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
			description: "text (with whitespace stripped) is equal to `<html><body><h1>Hello,World!</h1></body></html>`",
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						if (body.replace(/\s/g, "") == "<html><body><h1>Hello,World!</h1></body></html>") {
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
