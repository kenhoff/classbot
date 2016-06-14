var assignments = [];

require("fs").readdirSync(__dirname).forEach(function(file) {
	if (file != "index.js") {
		// pull in .mrkdwn file, parse, and build object before pushing onto exports
		assignments.push(require(__dirname + "/" + file));
	}
});

module.exports = assignments;
