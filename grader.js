if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}

var express = require('express');
var app = express();
var moment = require('moment');

var port = process.env.PORT || 1234;
app.use(express.static(__dirname + "/site/build", {
	extensions: ["html", "htm"]
}));
app.listen(port, function() {
	console.log("Listening on", port); // eslint-disable-line no-console
});


var assignments = require("./assignments");

var controller = require('botkit').slackbot({
	debug: false,
	storage: require('botkit-storage-firebase')({
		firebase_uri: process.env.FIREBASE_URL
	})
});

controller.spawn({
	token: process.env.SLACK_BOT_API_TOKEN
}).startRTM(function(err) {
	if (err) {
		console.log(err); // eslint-disable-line no-console
		throw new Error('Could not connect to Slack');
	} else {
		console.log("Connected to Slack"); // eslint-disable-line no-console
	}
});

controller.hears(['submit ([0-9]+)\s*(.*)'], ['direct_message'], function(bot, message) {
	var assignmentNumber = message.match[1];
	if (assignmentNumber > assignments.length - 1) {
		bot.reply(message, "Sorry! That assignment isn't available yet. See what assignments are available with `assignments`.");
	} else {
		var url = message.match[2].replace(/[<>]/g, "").trim();
		bot.reply(message, "Submitting " + url + " for Assignment #" + assignmentNumber + "...");
		bot.reply(message, "Processing " + url + " _(this may take a few moments)_");
		var cb = function(err, scoreObject) {
			if (err) {
				bot.reply(message, "Error: " + err);
			} else {
				bot.startPrivateConversation(message, function(err, convo) {
					convo.say("Done processing. Your score is: " + (scoreObject.score * 100).toFixed(2) + "%");
					var tests = [];
					for (var test of scoreObject.tests) {
						tests.push((test.passed ? ":white_check_mark:" : ":x:") + " " + test.description);
					}
					convo.say({
						attachments: [{
							fallback: "Test results for assignment " + assignmentNumber + ": " + url,
							text: tests.join("\n"),
							mrkdwn_in: ["text"]
						}]
					});
					// write score
					controller.storage.users.get(message.user, function(err, user_data) {
						if (!user_data) {
							user_data = {
								id: message.user
							};
						}
						if (!("id" in user_data)) {
							user_data.id = message.user;
						}
						if (!("assignments" in user_data)) {
							user_data.assignments = [];
						}
						user_data.assignments[parseInt(assignmentNumber)] = scoreObject;
						controller.storage.users.save(user_data, function(err) {
							if (err) {
								convo.say("Uh oh, we had a problem saving that grade. Try again?");
								convo.say(err);
							} else {
								convo.say("Assignment grade saved!");
							}
						});
					});
				});

			}
		};
		if ("test" in assignments[parseInt(assignmentNumber)]) {
			assignments[parseInt(assignmentNumber)].test(url, cb);
		} else {
			assignments[parseInt(assignmentNumber)](url, cb);
		}
	}
});

controller.hears(["grades", "grade"], ["direct_message"], function(bot, message) {
	bot.reply(message, "Looking up grades...");
	var assignmentText = [];
	controller.storage.users.get(message.user, function(err, user_data) {
		var userScore = 0;
		var totalScore = 0;
		for (var i = 0; i < assignments.length; i++) {
			if (("assignments" in user_data) && (user_data.assignments[i])) {
				if ("url" in user_data.assignments[i]) {
					var assignmentURL = " - " + user_data.assignments[i].url;
				} else {
					assignmentURL = "";
				}
				assignmentText.push("Assignment " + i + ": " + (user_data.assignments[i].score * 100).toFixed(2) + "%" + assignmentURL);
				userScore += user_data.assignments[i].score * 100;
			} else {
				assignmentText.push("Assignment " + i + ": 0%");
				userScore += 0;
			}
			totalScore += 100;
		}
		bot.reply(message, {
			attachments: [{
				fallback: "",
				text: assignmentText.join("\n"),
				mrkdwn_in: ["text"]
			}]
		});
		bot.reply(message, "Total: " + ((userScore / totalScore) * 100).toFixed(2) + "% _(" + userScore.toFixed(2) + "/" + totalScore.toFixed(2) + ")_");
	});
});

controller.hears(["help"], ["direct_message"], function(bot, message) {
	var listOfCommands = [
		"submit 0 my-awesome-app.firebaseapp.com",
		"submit 19 my-other-awesome-app.firebaseapp.com",
		"grades",
		"help"
	];
	for (var i = 0; i < listOfCommands.length; i++) {
		listOfCommands[i] = "`" + listOfCommands[i] + "`";
	}
	bot.reply(message, listOfCommands.join("\n"));
});

controller.hears(['.*'], ['direct_message'], function(bot, message) {
	bot.reply(message, "I'm sorry, I didn't quite understand that. For commands, type `help`");
});
