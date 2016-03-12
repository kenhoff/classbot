if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}

var assignments = [require('./assignments/assignment0.js'), require('./assignments/assignment1.js'), require('./assignments/assignment2.js'), require('./assignments/assignment3.js'), require('./assignments/assignment4.js'), require('./assignments/assignment5.js'), require('./assignments/assignment6.js'), require('./assignments/assignment7.js'), require('./assignments/assignment8.js'), require('./assignments/assignment9.js'), require('./assignments/assignment10.js')]

var controller = require('botkit').slackbot({
	debug: false,
	storage: require('botkit-storage-firebase')({
		firebase_uri: process.env.FIREBASE_URL
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

controller.hears(['submit ([0-9]+)\s*(.*)'], ['direct_message'], function(bot, message) {
	var assignmentNumber = message.match[1]
	if (assignmentNumber > assignments.length - 1) {
		bot.reply(message, "Sorry! That assignment isn't available yet. See what assignments are available with `assignments`.")
	} else {
		var url = message.match[2].replace(/[<>]/g, "").trim()
		bot.reply(message, "Submitting " + url + " for Assignment #" + assignmentNumber + "...")
		assignments[parseInt(assignmentNumber)](url, function(err, scoreObject) {
			if (err) {
				bot.reply(message, "Error: " + err)
			} else {
				bot.startPrivateConversation(message, function(err, convo) {
					convo.say("Done processing. Your score is: " + (scoreObject.score * 100).toFixed(2) + "%")
					for (var test of scoreObject.tests) {
						convo.say((test.passed ? ":white_check_mark:" : ":x:") + " " + test.description)
					}
					// write score
					controller.storage.users.get(message.user, function(err, user_data) {
						if (!user_data) {
							user_data = {
								id: message.user
							}
						}
						if (!("id" in user_data)) {
							user_data.id = message.user
						}
						if (!("assignments" in user_data)) {
							user_data.assignments = []
						}
						user_data.assignments[parseInt(assignmentNumber)] = scoreObject
						controller.storage.users.save(user_data, function(err) {
							if (err) {
								convo.say("Uh oh, we had a problem saving that grade. Try again?")
								convo.say(err)
							} else {
								convo.say("Assignment grade saved!")
							}
						})
					});
				})

			}
		})
	}
})

controller.hears(["assignments"], ["direct_message"], function(bot, message) {
	var availableAssignments = []
	for (var i = 0; i < assignments.length; i++) {
		availableAssignments.push("`" + i + "`")
	}
	bot.reply(message, "Available assignments are: " + availableAssignments.join(" "))
})

// controller.hears(["dump grades"], ["direct_message"], function(bot, message) {
// 	if (message.user == process.env.ADMIN_USER) {
// 		controller.storage.users.all(function(err, all_user_data) {
// 			bot.reply(message, "```" + JSON.stringify(all_user_data) + "```")
// 		})
// 	} else {
// 		bot.reply(message, "Insufficient permissions.")
// 	}
// })


controller.hears(["grades", "grade"], ["direct_message"], function(bot, message) {
	bot.startPrivateConversation(message, function(err, convo) {
		convo.say("Looking up grades...")
		controller.storage.users.get(message.user, function(err, user_data) {
			var userScore = 0
			var totalScore = 0
			for (var i = 0; i < assignments.length; i++) {
				if (("assignments" in user_data) && (user_data.assignments[i])) {
					convo.say("Assignment " + i + ": " + (user_data.assignments[i].score * 100).toFixed(2) + "%")
					userScore += user_data.assignments[i].score * 100
				} else {
					convo.say("Assignment " + i + ": 0%")
					userScore += 0
				}
				totalScore += 100
			}
			convo.say("Total: " + ((userScore / totalScore) * 100).toFixed(2) + "% _(" + userScore.toFixed(2) + "/" + totalScore.toFixed(2) + ")_")
		})
	})
})

controller.hears(["help"], ["direct_message"], function(bot, message) {
	var listOfCommands = [
		"submit <<assignmentNumber>> <<URL>>",
		"assignments",
		"grades",
		"help"
	]
	for (var i = 0; i < listOfCommands.length; i++) {
		listOfCommands[i] = "`" + listOfCommands[i] + "`"
	}
	bot.reply(message, listOfCommands.join("\n"))
})


controller.hears(['.*'], ['direct_message'], function(bot, message) {
	bot.reply(message, "I'm sorry, I didn't quite understand that. For commands, type `help`")
})
