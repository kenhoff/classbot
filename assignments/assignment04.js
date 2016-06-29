// Portfolio Site Show-and-Tell, Lab session

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = {
	description: "*Portfolio Site!*\n\nFor this assignment, just submit a link to the portfolio site that you built.\n\nA couple things:\n\n- Create a separate Firebase app, and keep that site live until the end of the class! You want to be able to show it to potential employers and clients.\n- The URL you put in here gets submitted along with your report card at the end of the class.\n- Keep on updating it, if you want! The best portfolios are ones that show that you're always growing.\n\nAnd of course, submit your site by running `submit 4 kens-awesome-portfolio.firebaseapp.com`.",
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
