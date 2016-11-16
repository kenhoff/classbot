var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var branch = require('metalsmith-branch');
var htmlToSlides = require('./htmlToSlides.js');
var changed = require('metalsmith-changed');
// const async = require('async');
// const pdf = require('html-pdf');

console.log("Starting..."); // eslint-disable-line no-console
Metalsmith(__dirname)
	.clean(false) // don't destroy `build` dir every time
	.use(changed()) // only write changed files
	.source(__dirname + "/src")
	.destination(__dirname + "/build")
	.use(markdown())
	// class syllabus
	.use(branch()
		.pattern(["index.html"])
		.use(layouts({
			engine: "jade",
			default: "syllabus.jade",
			directory: "layouts"
		}))
	)
	.use(branch()
		.pattern(["readings/**", "assignments/**"])
		.use(layouts({
			engine: "jade",
			default: "syllabus-item.jade",
			directory: "layouts"
		}))
	)
	// class slides
	.use(branch()
		.pattern(["slides/**", "!slides/index.md"])
		.use(htmlToSlides())
		.use(layouts({
			engine: "jade",
			default: "slides.jade",
			directory: "layouts"
		}))
		// .use(function(files, metalsmith, done) {
		// 	if (process.env.NODE_ENV != "development") {
		// 		async.map(Object.keys(files), function(file, cb) {
		// 			if (files.hasOwnProperty(file)) {
		// 				var html = files[file].contents.toString();
		// 				// pdf.create(html, {
		// 				// 	timeout: 180000
		// 				// }).toBuffer(function(err, buffer) {
		// 				// 	if (err) {
		// 				// 		cb(err);
		// 				// 	} else {
		// 				// 		files[file.split(".")[0] + ".pdf"] = {
		// 				// 			contents: buffer
		// 				// 		};
		// 				// 		cb();
		// 				// 	}
		// 				// });
		// 			}
		// 		}, function(err) {
		// 			if (err) {
		// 				throw err;
		// 			} else {
		// 				done();
		// 			}
		// 		});
		// 	} else {
		// 		done();
		// 	}
		// })
	)
	.build(function(err) {
		if (err) throw err;
		console.log("Finished!"); // eslint-disable-line no-console
	});
