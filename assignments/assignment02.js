// HTML tags & attributes, the `style` attribute

var calculateScore = require("../calculateScore.js");

var request = require('request');
var async = require('async');
var jsdom = require('jsdom');

var tags = ['html', 'head', 'body', 'p', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'strong', 'em', 'br', 'title', 'div', 'span'];

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

	for (var i = 0; i < tags.length; i++) {
		tests.push({
			tag: tags[i],
			description: "site has a `<" + tags[i] + ">` tag",
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, function(err, window) {
							if (window.document.getElementsByTagName(this.tag).length >= 1) {
								this.passed = true;
							} else {
								this.passed = false;
							}
							cb(null, this);
						}.bind(this));
					} else {
						this.passed = false;
						cb(null, this);
					}
				}.bind(this));
			}
		});
	}

	tests.push({
		description: 'site has a `<meta name="viewport" content="width=device-width, initial-scale=1">` tag',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var metaTags = window.document.getElementsByTagName('meta');
						if ((metaTags.length >= 1) && (metaTags[0].getAttribute("content") == "width=device-width, initial-scale=1") && (metaTags[0].getAttribute("name") == "viewport")) {
							this.passed = true;
						} else {
							this.passed = false;
						}
						cb(null, this);
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	}, {
		description: 'site has an `<a>` tag that points to a *valid page* on a *different domain* (e.g. `href` starts with `http` or `https`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var aTags = window.document.getElementsByTagName('a');
						if (aTags.length >= 1) {
							async.detectSeries(aTags, function(aTag, asyncCB) {
								if (aTag.getAttribute('href').startsWith('http') || aTag.getAttribute('href').startsWith('https')) {
									request(aTag.getAttribute('href'), function(err, response) {
										if (err || (parseInt(response.statusCode) >= 400)) {
											asyncCB(false);
										} else {
											asyncCB(true);
										}
									});
								} else {
									asyncCB(false);
								}
							}, function(aTag) {
								if (aTag) {
									this.passed = true;
								} else {
									this.passed = false;
								}
								cb(null, this);
							}.bind(this));
						} else {
							this.passed = false;
							cb(null, this);
						}
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	},

	// {
	// 	description: 'site has an `<a>` tag that points to a *valid page* on the *same domain* using an *absolute path* (e.g. `href` starts with `/`)',
	// 	assert: function(url, cb) {
	// 		request(url, function(error, response, body) {
	// 			if (!error && response.statusCode == 200) {
	// 				jsdom.env(body, function(err, window) {
	// 					var aTags = window.document.getElementsByTagName('a');
	// 					if (aTags.length >= 1) {
	// 						async.detectSeries(aTags, function(aTag, asyncCB) {
	// 							if (aTag.getAttribute('href').startsWith('/')) {
	// 								var pathArray = url.split('/');
	// 								var protocol = pathArray[0];
	// 								var host = pathArray[2];
	// 								var origin = protocol + '//' + host;
	// 								request(origin + aTag.getAttribute('href'), function(errrr, response) {
	// 									if (err || (parseInt(response.statusCode) >= 400)) {
	// 										asyncCB(false);
	// 									} else {
	// 										asyncCB(true);
	// 									}
	// 								});
	// 							} else {
	// 								asyncCB(false);
	// 							}
	// 						}.bind(this), function(aTag) {
	// 							if (aTag) {
	// 								this.passed = true;
	// 							} else {
	// 								this.passed = false;
	// 							}
	// 							cb(null, this);
	// 						}.bind(this));
	// 					} else {
	// 						this.passed = false;
	// 						cb(null, this);
	// 					}
	// 				}.bind(this));
	// 			} else {
	// 				this.passed = false;
	// 				cb(null, this);
	// 			}
	// 		}.bind(this));
	// 	}
	// },

	{
		description: 'site has an `<a>` tag that points to a *valid page* on the *same domain* (e.g. `href` does not start starts with `http` or `https`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var aTags = window.document.getElementsByTagName('a');
						if (aTags.length >= 1) {
							async.detectSeries(aTags, function(aTag, asyncCB) {
								if (!aTag.getAttribute('href').startsWith('/') && !aTag.getAttribute('href').startsWith('http')) {
									// lop off the last item, replace with href
									var pathArray = url.split('/');
									pathArray.splice(-1, 1);
									request(pathArray.join('/') + "/" + aTag.getAttribute('href'), function(err, response) {
										if (err || (parseInt(response.statusCode) >= 400)) {
											asyncCB(false);
										} else {
											asyncCB(true);
										}
									});
								} else {
									asyncCB(false);
								}
							}.bind(this), function(aTag) {
								if (aTag) {
									this.passed = true;
								} else {
									this.passed = false;
								}
								cb(null, this);
							}.bind(this));
						} else {
							this.passed = false;
							cb(null, this);
						}
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	}, {
		description: 'site has an `<img>` tag that points to a *valid image* on a *different domain* (e.g. `src` starts with `http` or `https`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var imgTags = window.document.getElementsByTagName('img');
						if (imgTags.length >= 1) {
							async.detectSeries(imgTags, function(imgTag, asyncCB) {
								if (imgTag.getAttribute('src').startsWith('http') || imgTag.getAttribute('src').startsWith('https')) {
									request(imgTag.getAttribute('src'), function(err, response) {
										if (err || (parseInt(response.statusCode) >= 400)) {
											asyncCB(false);
										} else {
											asyncCB(true);
										}
									});
								} else {
									asyncCB(false);
								}
							}, function(imgTag) {
								if (imgTag) {
									this.passed = true;
								} else {
									this.passed = false;
								}
								cb(null, this);
							}.bind(this));
						} else {
							this.passed = false;
							cb(null, this);
						}
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	},

	// {
	// 	description: 'site has an `<img>` tag that points to a *valid image* on the *same domain* using an *absolute path* (e.g. `src` starts with `/`)',
	// 	assert: function(url, cb) {
	// 		request(url, function(error, response, body) {
	// 			if (!error && response.statusCode == 200) {
	// 				jsdom.env(body, function(err, window) {
	// 					var imgTags = window.document.getElementsByTagName('img');
	// 					if (imgTags.length >= 1) {
	// 						async.detectSeries(imgTags, function(imgTag, asyncCB) {
	// 							if (imgTag.getAttribute('src').startsWith('/')) {
	// 								var pathArray = url.split('/');
	// 								var protocol = pathArray[0];
	// 								var host = pathArray[2];
	// 								var origin = protocol + '//' + host;
	// 								request(origin + imgTag.getAttribute('src'), function(errrr, response) {
	// 									if (err || (parseInt(response.statusCode) >= 400)) {
	// 										asyncCB(false);
	// 									} else {
	// 										asyncCB(true);
	// 									}
	// 								});
	// 							} else {
	// 								asyncCB(false);
	// 							}
	// 						}.bind(this), function(imgTag) {
	// 							if (imgTag) {
	// 								this.passed = true;
	// 							} else {
	// 								this.passed = false;
	// 							}
	// 							cb(null, this);
	// 						}.bind(this));
	// 					} else {
	// 						this.passed = false;
	// 						cb(null, this);
	// 					}
	// 				}.bind(this));
	// 			} else {
	// 				this.passed = false;
	// 				cb(null, this);
	// 			}
	// 		}.bind(this));
	// 	}
	// },

	{
		description: 'site has an `<img>` tag that points to a *valid image* on the *same domain* (e.g. `src` does not start starts with `http` or `https`)',
		assert: function(url, cb) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					jsdom.env(body, function(err, window) {
						var imgTags = window.document.getElementsByTagName('img');
						if (imgTags.length >= 1) {
							async.detectSeries(imgTags, function(imgTag, asyncCB) {
								if (!imgTag.getAttribute('src').startsWith('/') && !imgTag.getAttribute('src').startsWith('http')) {
									// lop off the last item, replace with src
									var pathArray = url.split('/');
									pathArray.splice(-1, 1);
									request(pathArray.join('/') + "/" + imgTag.getAttribute('src'), function(err, response) {
										if (err || (parseInt(response.statusCode) >= 400)) {
											asyncCB(false);
										} else {
											asyncCB(true);
										}
									});
								} else {
									asyncCB(false);
								}
							}.bind(this), function(imgTag) {
								if (imgTag) {
									this.passed = true;
								} else {
									this.passed = false;
								}
								cb(null, this);
							}.bind(this));
						} else {
							this.passed = false;
							cb(null, this);
						}
					}.bind(this));
				} else {
					this.passed = false;
					cb(null, this);
				}
			}.bind(this));
		}
	});

	async.map(tests, function(test, cb) {
		test.assert(url, cb);
	}, function() {
		for (var test of tests) {
			delete test.assert;
		}
		var scoreObject = {
			score: calculateScore(tests),
			tests: tests
		};
		return cb(null, scoreObject);
	});
};
