// The display and position styles

var calculateScore = require("../calculateScore.js");

var request = require('request');
var async = require('async');
var jsdom = require("jsdom");

/* styles:
	display block
	display inline
	display inline-block
	display none
	display flex
	position static
	position fixed
	position absolute
	position relative
	top
	right
	bottom
	left
	z-index
*/

var stylesRequired = ["top", "right", "bottom", "left", "z-index"];

var styleValuesRequired = [
	["display", "block"],
	["display", "inline"],
	["display", "inline-block"],
	["display", "none"],
	["display", "flex"],
	["position", "static"],
	["position", "fixed"],
	["position", "absolute"],
	["position", "relative"]
];

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

		for (style of styleValuesRequired) {
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
										if (window.getComputedStyle(element)[this.style[0]] == [this.style[1]]) {
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
	}
};
