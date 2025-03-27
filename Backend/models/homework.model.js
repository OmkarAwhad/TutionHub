const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
		required: true,
	},
	tutor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	description: {
		type: String,
	},
	fileUrl: {
		type: String,
	},
	dueDate: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Homework", homeworkSchema);
