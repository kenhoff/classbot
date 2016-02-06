module.exports = function(url, cb) {
	if (!url) {
		return cb("URL not found")
	}
	tests = [{
		description: "submitted url was `http://sparkboulder.com`", // the thing pumped back into slack
		assert: function(url) {
			if (url == "http://sparkboulder.com") {
				this.passed = true
			} else {
				this.passed = false
			}
		}
	}]
	for (test of tests) {
		test.assert(url)
	}
	scoreObject = {
		score: calculateScore(tests),
		tests: tests
	}
	return cb(null, scoreObject)
}

calculateScore = function(tests) {
	passedTestCount = 0
	for (test of tests) {
		if (test.passed == true) {
			passedTestCount += 1
		}
	}
	return passedTestCount / tests.length
}
