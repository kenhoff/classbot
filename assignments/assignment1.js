var request = require('request');
var async = require('async');

module.exports = function(url, cb) {
	console.log("evaluating assignment 1");

	// request(url, function(error, response, body) {
	// 	if (!error && response.statusCode == 200) {
	// 		if (body.replace(/\s/g, "") == "<html><body><h1>Hello,World!</h1></body></html>") {
	// 			console.log("body matches");
	// 		} else {
	// 			console.log("body does not match");
	// 		}
	// 	}
	// })
	if (!url) {
		return cb("URL not found")
	}
	tests = [{
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
	}, {
		description: "text (with whitespace stripped) is equal to `<html><body><h1>Hello,World!</h1></body></html>`",
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					if (body.replace(/\s/g, "") == "<html><body><h1>Hello,World!</h1></body></html>") {
						this.passed = true
						cb(null, this)
					} else {
						this.passed = false
						cb(null, this)
					}
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
		console.log("done with tests");
		scoreObject = {
			score: calculateScore(tests),
			tests: tests
		}
		return cb(null, scoreObject)
	})
}
