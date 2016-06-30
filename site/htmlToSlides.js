// use metalsmith-branch to specify the specific files that you want to use

module.exports = function() {
	return function(files, metalsmith, done) {
		for (var file in files) {
			if (files.hasOwnProperty(file)) {
				var html = Buffer(files[file].contents).toString()
				var slides = html.split("<hr>")
				var newSlides = []
				for (var slide of slides) {
					newSlides.push("<section class=\"slide\">" + slide + "</section>")
				}
				files[file].contents = Buffer(newSlides.join(""))
			}
		}
		done();
	}
}
