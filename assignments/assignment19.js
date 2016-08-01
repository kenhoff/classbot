// Random Quote App Show-and-Tell, wrap-up/party

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');

module.exports = {
	description: "*Random Quote App Show-and-Tell, wrap-up/party :tada:*\n\nI'm going to have you build an app that displays a random quote whenever you visit the page!\n\nYour Random Quote App must do three things:\n\n-   When a user comes to the page, it displays a quote, pulled at random from a list of quotes\n-   A user can click a button to get a new quote, pulled at random from a list of quotes\n-   *A user can fill out a text box and submit a new quote to be included in the list of quotes*\n\nSubmit your Random Quote App with `submit 19 https://your-random-quote-app.firebaseapp.com`. You can also get this information with `readings 19`. Remember to keep the site live after the class ends, so that potential employers and clients can see it!\n\nBut wait - you need a \"backend\" for the Random Quote App!\n\nSo I built one for you! `randomquote` is a REST API that allows you to retrieve quotes from lists of quotes, and add new quotes to lists of quotes.\n\nDocumentation is available at <http://randomquote.hoff.tech>.\n\nFor this project, you'll only need to do two main things:\n\n-   Retrieve a random quote from a list of quotes\n-   Add a new quote to a list of quotes\n\n(but, the API provides many more functions than that! Feel free to use them)",
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
