module.exports = [];

require("fs").readdirSync(__dirname).forEach(function(file) {
	if (file != "index.js") {
		module.exports.push(require("./" + file));
	}
});
