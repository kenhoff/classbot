// Advanced Topics: Back End Web Development with Node.js

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

var names = ["kirk", "spock", "bones", "uruha", "scotty", "chekov", "sulu"];

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
				let testingURL;
				if (url.endsWith("/")) {
					testingURL = url + "hello/" + this.name;
				} else {
					testingURL = url + "/hello/" + this.name;
				}
				request(testingURL, function(error, response) {
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
