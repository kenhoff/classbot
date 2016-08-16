// Introduction, first HTML page

var calculateScore = require("../calculateScore.js");

module.exports = {
	description: "Welcome to the first assignment! Just go ahead and submit the URL `http://sparkboulder.com` by typing `submit 0 http://sparkboulder.com`.",
	test: function(url, cb) {
		if (!url) {
			return cb("URL not found");
		}
		var tests = [{
			description: "submitted url was `http://sparkboulder.com`", // the thing pumped back into slack
			assert: function(url) {
				if (url == "http://sparkboulder.com") {
					this.passed = true;
				} else {
					this.passed = false;
				}
			}
		}];
		for (var test of tests) {
			test.assert(url);
			delete test.assert;
		}
		var scoreObject = {
			score: calculateScore(tests),
			tests: tests,
			url: url
		};
		return cb(null, scoreObject);
	}
};
