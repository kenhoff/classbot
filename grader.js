var express = require('express');
var app = express();
var moment = require('moment');

var port = process.env.PORT || 3000;
app.listen(port); // binding to a port just for heroku

if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}

var assignments = [require('./assignments/assignment0.js'), require('./assignments/assignment1.js'), require('./assignments/assignment2.js'), require('./assignments/assignment3.js'), require('./assignments/assignment4.js'), require('./assignments/assignment5.js'), require('./assignments/assignment6.js'), require('./assignments/assignment7.js'), require('./assignments/assignment8.js'), require('./assignments/assignment9.js'), require('./assignments/assignment10.js'), require('./assignments/assignment11.js'), require('./assignments/assignment12.js'), require('./assignments/assignment13.js'), require('./assignments/assignment14.js'), require('./assignments/assignment15.js'), require('./assignments/assignment16.js'), require('./assignments/assignment17.js'), require('./assignments/assignment18.js'), require('./assignments/assignment19.js')];

var readings = require("./readings");
var sessions = require("./sessions");

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
		console.log(err);
		throw new Error('Could not connect to Slack');
	} else {
		console.log("Connected to Slack");
	}
});

controller.hears(['submit ([0-9]+)\s*(.*)'], ['direct_message'], function(bot, message) {
	var assignmentNumber = message.match[1];
	if (assignmentNumber > assignments.length - 1) {
		bot.reply(message, "Sorry! That assignment isn't available yet. See what assignments are available with `assignments`.");
	} else {
		var url = message.match[2].replace(/[<>]/g, "").trim();
		bot.reply(message, "Submitting " + url + " for Assignment #" + assignmentNumber + "...");
		assignments[parseInt(assignmentNumber)](url, function(err, scoreObject) {
			if (err) {
				bot.reply(message, "Error: " + err);
			} else {
				bot.startPrivateConversation(message, function(err, convo) {
					convo.say("Done processing. Your score is: " + (scoreObject.score * 100).toFixed(2) + "%");
					for (var test of scoreObject.tests) {
						convo.say((test.passed ? ":white_check_mark:" : ":x:") + " " + test.description);
					}
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
		});
	}
});

controller.hears(["assignments"], ["direct_message"], function(bot, message) {
	var availableAssignments = [];
	for (var i = 0; i < assignments.length; i++) {
		availableAssignments.push("`" + i + "`");
	}
	bot.reply(message, "Available assignments are: " + availableAssignments.join(" "));
});

controller.hears(["grades", "grade"], ["direct_message"], function(bot, message) {
	bot.startPrivateConversation(message, function(err, convo) {
		convo.say("Looking up grades...");
		controller.storage.users.get(message.user, function(err, user_data) {
			var userScore = 0;
			var totalScore = 0;
			for (var i = 0; i < assignments.length; i++) {
				if (("assignments" in user_data) && (user_data.assignments[i])) {
					convo.say("Assignment " + i + ": " + (user_data.assignments[i].score * 100).toFixed(2) + "%");
					userScore += user_data.assignments[i].score * 100;
				} else {
					convo.say("Assignment " + i + ": 0%");
					userScore += 0;
				}
				totalScore += 100;
			}
			convo.say("Total: " + ((userScore / totalScore) * 100).toFixed(2) + "% _(" + userScore.toFixed(2) + "/" + totalScore.toFixed(2) + ")_");
		});
	});
});

controller.hears(["help"], ["direct_message"], function(bot, message) {
	var listOfCommands = [
		"sessions",
		"session <<sessionNumber>>",
		"readings <<sessionNumber>>",
		"submit <<assignmentNumber>> <<URL>>",
		"grades",
		"help"
	];
	for (var i = 0; i < listOfCommands.length; i++) {
		listOfCommands[i] = "`" + listOfCommands[i] + "`";
	}
	bot.reply(message, listOfCommands.join("\n"));
});

controller.hears(["session ([0-9]+)"], ["direct_message"], function(bot, message) {
	var session = sessions[message.match[1]];
	var text = ["*Session " + session.id + "* - " + moment(session.date, "YYYY.MM.DD").format("dddd, MMMM Do") + " \n",
		"*Readings to be completed prior to " + session.id + ":* " + "type `readings " + session.id + "` to view",
		"*Slides:* <" + session.lecture_slides + "|Session " + session.id + " slides>",
		"*Assignment:* " + "to submit assignment " + session.id + ", type `submit " + session.id + " https://your-url-here.example.com`"
	];


	bot.reply(message, {
		attachments: [{
			fallback: "Information for Session " + session.id,
			text: text.join("\n"),
			mrkdwn_in: ["text"]
		}]
	});
});

controller.hears(["sessions"], ["direct_message"], function(bot, message) {
	var listOfSessions = [];
	for (var session of sessions) {
		listOfSessions.push("*Session " + session.id + ":* " + moment(session.date, "YYYY MM DD").format("dddd, MMMM Do"));
	}
	bot.reply(message, {
		attachments: [{
			fallback: "Session information",
			text: "*Sessions*\n\n" + listOfSessions.join("\n") + "\n\nTo get more info about a session, type `session <<sessionNumber>>`, like `session 0` or `session 19`",
			mrkdwn_in: ["text"]
		}]
	});
});

controller.hears(["readings ([0-9]+)"], ["direct_message"], function(bot, message) {
	var readingNumber = parseInt(message.match[1]);
	if (readingNumber >= readings.length) {
		bot.reply(message, "Whoops! Looks like the readings for session " + readingNumber + " aren't available yet.");
	} else {
		bot.reply(message, {
			attachments: [{
				fallback: "Reading material for session " + readingNumber,
				text: readings[readingNumber],
				mrkdwn_in: ["text"]
			}]
		});
	}
});

controller.hears(['.*'], ['direct_message'], function(bot, message) {
	bot.reply(message, "I'm sorry, I didn't quite understand that. For commands, type `help`");
});
