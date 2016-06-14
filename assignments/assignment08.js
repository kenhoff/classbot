// Working with Clients, Customers, Designers and Product managers

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = function(url, cb) {
	if (!url) {
		return cb("URL not found")
	}
	var tests = [{
		description: "submitted URL was accessible from the internet",
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					this.passed = true
					cb(null, this)
				} else {
					this.passed = false
					cb(null, this)
				}
			}.bind(this))
		}
	}]

	async.map(tests, function(test, cb) {
		test.assert(url, cb)
	}, function(err, results) {
		for (var test of tests) {
			delete test.assert
		}
		var scoreObject = {
			score: calculateScore(tests),
			tests: tests,
			url: url
		}
		return cb(null, scoreObject)
	})
}
