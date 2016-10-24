// The CSS Box Model (height, width, border, padding, margin, and box-sizing)

var request = require('request');
var async = require('async');
var calculateScore = require('../calculateScore.js');
const jsdom = require("jsdom");

var stylesRequired = ['width', 'height', ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], 'border-radius', 'border-width', 'border-style', ['margin-top', 'margin-bottom', 'margin-left', 'margin-right'], 'box-sizing'];

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
		}];

		for (var style of stylesRequired) {
			tests.push({
				style: style,
				description: 'site has an element that has a `' + (
					Array.isArray(style) ? style.join("` or `") : style
				) + '` assigned',
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
										// if the style is an array (one of the array), do a different check
										if (Array.isArray(this.style)) {
											for (var testStyle of this.style) {
												if (window.getComputedStyle(element)[testStyle]) {
													this.passed = true;
													return cb(null, this);
												}
											}
										} else {
											// else, do a normal check
											// check the element's style to see if it's got the style we're testing for
											if (window.getComputedStyle(element)[this.style]) {
												this.passed = true;
												return cb(null, this);
											}
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
	}
};
