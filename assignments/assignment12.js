// Javascript 103: objects and arrays

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = {
	description: "This is an easy one - I'd just like for you to define an array and an object, `myArray` and `myObject` with some specific contents.\n\nRun `submit 12 http://your-firebase-app-here.firebaseapp.com` to get started!",
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
		}, require("./tests/my_array.js"), require("./tests/my_object.js")];

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
}
