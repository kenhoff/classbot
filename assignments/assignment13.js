// Javascript 104: working with the browser API

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

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
		}, require("./tests/get_element_by_id.js"), require("./tests/get_elements_by_class_name.js")];

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
