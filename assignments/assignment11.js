// Javascript 102: variables, loops, and functions

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = {
	description: "For this assignment, you're going to have to create some variables and functions.\n\nDon't *call* the functions on your page, just create them. While you're developing, you should call them to ensure that they're performing correctly, but if you call them on the submitted page, it will screw up your results.\n\nRun `submit 11 your-domain-here.firebaseapp.com` to see what tests you have to pass!",
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
		}, require("./tests/my_number.js"), require("./tests/my_string.js"), require("./tests/hello_world.js"), require("./tests/say_hello.js"), require("./tests/create_hello_string.js"), require("./tests/is_this_person_old.js"), require("./tests/count_to_100.js")];

		async.map(tests, function(test, cb) {
			test.assert(url, cb);
		}, function() {
			var newTests = [];
			for (var test of tests) {
				newTests.push({
					description: test.description,
					passed: test.passed
				});
			}
			var scoreObject = {
				score: calculateScore(newTests),
				tests: newTests,
				url: url
			};
			return cb(null, scoreObject);
		});
	}
};
