var request = require('request');
var async = require('async');
var jsdom = require('jsdom');

// external style sheet
// `div` with an `id` of `main-content`
// `div` with a `class` of `profile-section`
// `color` assigned
// `background-color` assigned
// `font-style` assigned
// `font-size` assigned
// `font-family` assigned
// `display` of `block`
// `display` of `inline`
// `width` assigned
// `height` assigned
// `padding` assigned
// `padding-top`, `padding-bottom`, `padding-left` **or** `padding-right` assigned
// `border` assigned
// `border-top`, `border-bottom`, `border-left` **or** `border-right` assigned
// `border-color` assigned
// `border-radius` assigned
// `border-width` assigned
// `border-style` assigned
// `margin` assigned
// `margin-top`, `margin-bottom`, `margin-left` **or** `margin-right` assigned

stylesRequired = ['color', 'background-color', 'font-style', 'font-family', 'font-size', 'width', 'height', 'padding', ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], 'border', ['border-top', 'border-bottom', 'border-left', 'border-right'], 'border-color', 'border-radius', 'border-width', 'border-style', 'margin', ['margin-top', 'margin-bottom', 'margin-left', 'margin-right']]

module.exports = function(url, cb) {
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
	}]
	for (style of stylesRequired) {
		tests.push({
			style: style,
			description: 'site has an element that has a `' + (
				Array.isArray(style) ? style.join("` or `") : style
			) + '` assigned',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					cb(null, this)
						// if (!error && response.statusCode == 200) {
						// 	jsdom.env(body, function(err, window) {
						// 		elements = window.document.getElementsByTagName('*')
						// 		if (elements.length >= 1) {
						// 			async.detectSeries(elements, function(element, asyncCB) {
						// 				if (element.getAttribute('href').startsWith('http') || element.getAttribute('href').startsWith('https')) {
						// 					request(element.getAttribute('href'), function(err, response, body) {
						// 						if (parseInt(response.statusCode) >= 400) {
						// 							asyncCB(false)
						// 						} else {
						// 							asyncCB(true)
						// 						}
						// 					})
						// 				} else {
						// 					asyncCB(false)
						// 				}
						// 			}, function(element) {
						// 				if (element) {
						// 					this.passed = true
						// 				} else {
						// 					this.passed = false
						// 				}
						// 				cb(null, this)
						// 			}.bind(this))
						// 		} else {
						// 			this.passed = false
						// 			cb(null, this)
						// 		}
						// 	}.bind(this))
						// } else {
						// 	this.passed = false
						// 	cb(null, this)
						// }
				}.bind(this))
			}
		})
	}

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
