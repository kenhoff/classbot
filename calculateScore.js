
module.exports = function(tests) {
	passedTestCount = 0
	for (test of tests) {
		if (test.passed == true) {
			passedTestCount += 1
		}
	}
	return passedTestCount / tests.length
}
