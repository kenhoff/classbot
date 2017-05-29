// Flexbox and media queries

var calculateScore = require("../calculateScore.js");

var request = require('request');
var async = require('async');
var jsdom = require("jsdom");

/*
	display flex
	flex-direction row
	flex-direction column
	flex-wrap wrap
	justify-content flex-start
	justify-content flex-end
	justify-content center
	justify-content space-between
	justify-content space-around
	align-items flex-start
	align-items flex-end
	align-items flex-center
*/

var styleValuesRequired = [
	["display", "flex", "display"],
	["flex-direction", "row", "flexDirection"],
	["flex-direction", "column", "flexDirection"],
	["flex-wrap", "wrap", "flexWrap"],
	["justify-content", "flex-start", "justifyContent"],
	["justify-content", "flex-end", "justifyContent"],
	["justify-content", "center", "justifyContent"],
	["justify-content", "space-between", "justifyContent"],
	["justify-content", "space-around", "justifyContent"],
	["align-items", "flex-start", "alignItems"],
	["align-items", "flex-end", "alignItems"],
	["align-items", "flex-center", "alignItems"]
];

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
	}];
	for (var style of styleValuesRequired) {
		tests.push({
			style: style,
			description: 'site has an element that has `' + style[0] +
				": " + style[1] +
				'` assigned',
			assert: function(url, cb) {
				request(url, function(error, response) {
					if (!error && response.statusCode == 200) {
						jsdom.env({
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								// console.log(jsdom.serializeDocument(window.document))
								var elements = window.document.getElementsByTagName('*');
								for (var element of elements) {
									// check the element's style to see if it's got the style we're testing for
									if (window.getComputedStyle(element)[this.style[2]] == [this.style[1]]) {
										this.passed = true;
										return cb(null, this);
									}
								}
								this.passed = false;
								return cb(null, this);
							}.bind(this)
						});
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
