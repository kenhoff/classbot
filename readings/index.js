var readings = [];

require("fs").readdirSync(__dirname).forEach(function(file) {
	if (file != "index.js") {
		// pull in .mrkdwn file, parse, and build object before pushing onto exports
		readings.push(require("fs").readFileSync(__dirname + "/" + file, "utf8"));
	}
});

module.exports = readings;
