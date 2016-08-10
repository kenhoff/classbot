// jQuery 203: HTTP requests with jQuery
/*
Hmmm...what can we do to test this?

I suppose I could throw a spy on $.get and $.post, but that doesn't cover ajax. maybe if i throw a spy on .ajax, that'll cover both get and post?


*/



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
	}, require("./tests/jquery_get_request.js"), require("./tests/jquery_post_request.js")];

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
};
