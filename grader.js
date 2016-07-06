if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}

var express = require('express');
var app = express();
var moment = require('moment');

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/site/build", {
	extensions: ["html", "htm"]
}));
app.listen(port, function() {
	console.log("Listening on", port); // eslint-disable-line no-console
});


var assignments = require("./assignments");
var readings = require("./readings");
var sessions = require("./sessions.js");

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

controller.hears(["assignments"], ["direct_message"], function(bot, message) {
	var availableAssignments = [];
	for (var i = 0; i < assignments.length; i++) {
		availableAssignments.push("`" + i + "`");
	}
	bot.reply(message, "Available assignments are: " + availableAssignments.join(" "));
});

controller.hears(["assignment ([0-9]*)"], ["direct_message"], function(bot, message) {
	if (message.match[1]) {
		var assignmentNumber = parseInt(message.match[1]);
		if (assignmentNumber > assignments.length - 1) {
			bot.reply(message, "Sorry! That assignment isn't available yet. See what assignments are available with `assignments`.");
		} else {
			if (assignments[assignmentNumber].description) {
				bot.reply(message, "*Assignment " + assignmentNumber + "*\n\n" + assignments[assignmentNumber].description);
			} else {
				bot.reply(message, "Hmm...a description for that assignment isn't available yet! Check back later.");
			}
		}
	} else {
		bot.reply(message, "Wait...what?");
	}
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
		"assignments",
		"session 0",
		"session 19",
		"readings 0",
		"readings 19",
		"assignment 0",
		"assignment 19",
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

controller.hears(["session ([0-9]+)"], ["direct_message"], function(bot, message) {
	if (parseInt(message.match[1]) < sessions.length) {
		var session = sessions[parseInt(message.match[1])];
		var text = ["*Session " + session.id + "* - " + session.title,
			moment(session.date, "YYYY.MM.DD").format("dddd, MMMM Do") + "\n",
			"*Readings to be completed prior to session" + session.id + ":* " + "type `readings " + session.id + "` to view",
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
	} else {
		bot.reply(message, "Sorry! I don't have information about that session yet.");
	}
});

controller.hears(["sessions"], ["direct_message"], function(bot, message) {
	var listOfSessions = [];
	for (var session of sessions) {
		listOfSessions.push(buildSessionText(session));
	}
	var sessionsText = "*Sessions*\n\n";
	sessionsText += listOfSessions.join("\n");
	sessionsText += "\n\nTo get more info about a session, type `session <<sessionNumber>>`, like `session 0` or `session 19`";
	bot.reply(message, {
		attachments: [{
			fallback: "",
			text: sessionsText,
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

var buildSessionText = function(session) {
	var sessionText = "*Session " + session.id + "*";
	var date = moment(session.date, "YYYY MM DD").format("ddd, MMM Do");
	var title = session.title;
	var slides = "<" + session.lecture_slides + "|Slides>";
	var text = [sessionText, date, slides, title].join("\t");

	if ("notes" in session) {
		text += "\t" + session.notes;
	}
	return text;
};
