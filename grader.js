if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}

var Botkit = require('botkit');

assignments = [require('./assignments/assignment0.js'), require('./assignments/assignment1.js')]

console.log(assignments);

controller = Botkit.slackbot({
	debug: false,
	storage: require('botkit-storage-redis')({
		url: process.env.REDIS_URL
	})
})

controller.spawn({
	token: process.env.SLACK_BOT_API_TOKEN
}).startRTM(function(err, bot, payload) {
	if (err) {
		console.log(err);
		throw new Error('Could not connect to Slack');
	} else {
		console.log("Connected to Slack");
	}
})

controller.hears(['submit assignment([0-9]+) (.*)'], ['direct_message'], function(bot, message) {
	assignmentNumber = message.match[1]
	url = message.match[2].replace(/[<>]/g, "")
	bot.startPrivateConversation(message, function(err, convo) {
		if (err) {
			convo.say("Whoa, ran into an issue there. Try again?")
		} else {
			convo.say("Submitting " + url + " for Assignment #" + assignmentNumber + "...")
			assignments[parseInt(assignmentNumber)](url, function(err, scoreObject) {
				if (err) {
					convo.say("Error: " + err)
				} else {
					convo.say("Done processing. Your score is: " + scoreObject.score * 100 + "%")
					for (test of scoreObject.tests) {
						convo.say((test.passed ? ":white_check_mark:" : ":x:") + " " + test.description)
					}

				}
			})
		}
	})
})

controller.hears(['.*'], ['direct_message'], function(bot, message) {
	bot.reply(message, "I'm sorry, I didn't quite understand that. To submit an assignment, try something like:\n`submit assignment0 http://sparkboulder.com`")
})
