// Bootstrap & CSS frameworks

var calculateScore = require("../calculateScore.js");

var request = require('request');
var async = require('async');
var jsdom = require("jsdom");

// Your site needs to include:
//
// - the standard Bootstrap CSS from bootstrapcdn.com
// - the standard Bootstrap Theme CSS from bootstrapcdn.com
// - jQuery from the googleapis.com CDN
// - the standard Bootstrap Javascript script from bootstrapcdn.com
//
// - Standard components
//   - a `.glyphicon` element
//   - a `.dropdown` element
//   - a `.btn-group` element
//   - a `.nav` element
//   - a `.navbar` element
//   - a `.breadcrumb` element
//   - a `.label` element
//   - a `.jumbotron` element
// - Javascript components
//   - a `.modal` element
//   - a `.carousel` element
//   - a `.dropdown` element


module.exports = {
	description: "For this assignment, I'd like you to include some links to the standard Bootstrap CSS and JavaScript on your site, as well as a bunch of Bootstrap grid items and components!\n\nYou can submit your site by using `submit 7 your-site-here.firebaseapp.com`.",
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
		}, {
			description: 'site has the standard Bootstrap CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('link');
								for (var element of elements) {
									if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css") {
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
		}, {
			description: 'site has the standard Bootstrap Theme CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('link');
								for (var element of elements) {
									if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css") {
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
		}, {
			description: 'site has jQuery from googleapis.com (a `script` with `src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('script');
								for (var element of elements) {
									if (element.getAttribute("src") == "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js") {
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
		}, {
			description: 'the standard Bootstrap Javascript script from bootstrapcdn.com (a `script` with `src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('script');
								for (var element of elements) {
									if (element.getAttribute("src") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js") {
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
		}, {
			description: 'site has the standard Bootstrap CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('link');
								for (var element of elements) {
									if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css") {
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
		}, {
			description: 'site has the standard Bootstrap Theme CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('link');
								for (var element of elements) {
									if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css") {
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
		}, {
			description: 'site has jQuery from googleapis.com (a `script` with `src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('script');
								for (var element of elements) {
									if (element.getAttribute("src") == "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js") {
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
		}, {
			description: 'the standard Bootstrap Javascript script from bootstrapcdn.com (a `script` with `src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"`)',
			assert: function(url, cb) {
				request(url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						jsdom.env(body, {
							url: url,
							features: {
								FetchExternalResources: ["link", "css"]
							},
							done: function(err, window) {
								var elements = window.document.getElementsByTagName('script');
								for (var element of elements) {
									if (element.getAttribute("src") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js") {
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
		}];



		classes = ["glyphicon", "dropdown", "btn-group", "nav", "navbar", "breadcrumb", "label", "jumbotron", "modal", "carousel", "dropdown"];

		for (bootstrapClass of classes) {
			tests.push({
				bootstrapClass: bootstrapClass,
				description: 'a `div` with class `' + (bootstrapClass.endsWith("-") ? bootstrapClass + "*" : bootstrapClass) + "`",
				assert: function(url, cb) {
					request(url, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							jsdom.env(body, {
								url: url,
								features: {
									FetchExternalResources: ["link", "css"]
								},
								done: function(err, window) {
									var elements = window.document.getElementsByTagName('*');
									for (var element of elements) {
										if (element.getAttribute("class") && element.getAttribute("class").includes(this.bootstrapClass)) {
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

		var classes = ["container", "row", "col-xs-"];

		for (var bootstrapClass of classes) {
			tests.push({
				bootstrapClass: bootstrapClass,
				description: 'a `div` with class `' + (bootstrapClass.endsWith("-") ? bootstrapClass + "*" : bootstrapClass) + "`",
				assert: function(url, cb) {
					request(url, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							jsdom.env(body, {
								url: url,
								features: {
									FetchExternalResources: ["link", "css"]
								},
								done: function(err, window) {
									var elements = window.document.getElementsByTagName('div');
									for (var element of elements) {
										if (element.getAttribute("class") && element.getAttribute("class").includes(this.bootstrapClass)) {
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





// // Bootstrap Themes & Customization
//
// var calculateScore = require("../calculateScore.js");
//
// var request = require('request');
// var async = require('async');
// var jsdom = require("jsdom")
//
// // Your site needs to include:
// //
// // - the standard Bootstrap CSS from bootstrapcdn.com
// // - jQuery from the googleapis.com CDN
// // - the standard Bootstrap Javascript script from bootstrapcdn.com
// // - the standard CSS from one of the following Bootswatch Themes from [bootstrapcdn.com](https://www.bootstrapcdn.com/bootswatch/)
// //   - Cerulean
// //   - Cosmo
// //   - Cyborg
// //   - Darkly
// //   - Flatly
// //   - Journal
// //   - Lumen
// //   - Paper
// //   - Readable
// //   - Sandstone
// //   - Simplex
// //   - Slate
// //   - Spacelab
// //   - Superhero
// //   - United
// //   - Yeti
//
// bootswatchThemes = [
// 	"Cerulean",
// 	"Cosmo",
// 	"Cyborg",
// 	"Darkly",
// 	"Flatly",
// 	"Journal",
// 	"Lumen",
// 	"Paper",
// 	"Readable",
// 	"Sandstone",
// 	"Simplex",
// 	"Slate",
// 	"Spacelab",
// 	"Superhero",
// 	"United",
// 	"Yeti"
// ]
//
//
// bootswatchThemesString = function() {
// 	var stringArray = []
// 	for (var i = 0; i < bootswatchThemes.length; i++) {
// 		stringArray.push("`" + bootswatchThemes[i].toLowerCase() + "`")
// 	}
// 	return stringArray.join(", ")
// }()
//
// module.exports = function(url, cb) {
// 	if (!url) {
// 		return cb("URL not found")
// 	}
// 	tests = [{
// 		description: "submitted URL was accessible from the internet",
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					this.passed = true
// 					cb(null, this)
// 				} else {
// 					this.passed = false
// 					cb(null, this)
// 				}
// 			}.bind(this))
// 		}
// 	}, {
// 		description: 'site has the standard Bootstrap CSS from bootstrapcdn.com (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"`)',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('link')
// 							for (element of elements) {
// 								if (element.getAttribute("href") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css") {
// 									this.passed = true
// 									return cb(null, this)
// 								}
// 							}
// 							this.passed = false
// 							return cb(null, this)
// 						}.bind(this)
// 					})
// 				} else {
// 					this.passed = false
// 					cb(null, this)
// 				}
// 			}.bind(this))
// 		}
// 	}, {
// 		description: 'site has the standard CSS from one of the Bootswatch Themes (a `link` with `href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/<<theme>>/bootstrap.min.css"`, where `<<theme>>` is one of ' + bootswatchThemesString + ')',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('link')
// 							for (element of elements) {
// 								for (var i = 0; i < bootswatchThemes.length; i++) {
// 									if (element.getAttribute("href").includes(bootswatchThemes[i].toLowerCase())) {
// 										this.passed = true
// 										return cb(null, this)
// 									}
// 								}
// 							}
// 							this.passed = false
// 							return cb(null, this)
// 						}.bind(this)
// 					})
// 				} else {
// 					this.passed = false
// 					cb(null, this)
// 				}
// 			}.bind(this))
// 		}
// 	}, {
// 		description: 'site has jQuery from googleapis.com (a `script` with `src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"`)',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('script')
// 							for (element of elements) {
// 								if (element.getAttribute("src") == "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js") {
// 									this.passed = true
// 									return cb(null, this)
// 								}
// 							}
// 							this.passed = false
// 							return cb(null, this)
// 						}.bind(this)
// 					})
// 				} else {
// 					this.passed = false
// 					cb(null, this)
// 				}
// 			}.bind(this))
// 		}
// 	}, {
// 		description: 'the standard Bootstrap Javascript script from bootstrapcdn.com (a `script` with `src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"`)',
// 		assert: function(url, cb) {
// 			request(url, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					jsdom.env(body, {
// 						url: url,
// 						features: {
// 							FetchExternalResources: ["link", "css"]
// 						},
// 						done: function(err, window) {
// 							elements = window.document.getElementsByTagName('script')
// 							for (element of elements) {
// 								if (element.getAttribute("src") == "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js") {
// 									this.passed = true
// 									return cb(null, this)
// 								}
// 							}
// 							this.passed = false
// 							return cb(null, this)
// 						}.bind(this)
// 					})
// 				} else {
// 					this.passed = false
// 					cb(null, this)
// 				}
// 			}.bind(this))
// 		}
// 	}]
//
// 	async.map(tests, function(test, cb) {
// 		test.assert(url, cb)
// 	}, function(err, results) {
// 		for (test of tests) {
// 			delete test.assert
// 		}
// 		scoreObject = {
// 			score: calculateScore(tests),
// 			tests: tests
// 		}
// 		return cb(null, scoreObject)
// 	})
// }
