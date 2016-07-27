// Hackertyper project Show-and-Tell, Lab session

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');



module.exports = {
	description: "For this project, you're gonna play the role of IBM, and I'm gonna play the role of the TSA.\n\n*I need a web app that, when you hit a button (or press a key), creates an arrow pointing left or right.*\n\nIf you'd like, you can model it after https://tsa-randomizer.hoff.tech/ - but if you just copy-paste, that's a *Bad Thing*.\n\nSubmit your version of the app for assignment 14, using `submit 14 your-tsa-randomizer-app.firebaseapp.com`. Remember to create a separate Firebase project for it, and keep it up after the class ends!\n\nFor more info on the project, check out `readings 14`.",
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
