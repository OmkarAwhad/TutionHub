const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	day: {
		type: String,
	},
	tutor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
	},
	description: {
		type: String,
		enum: ["Test", "Lecture"],
	},
	marksMarked: {
		type: Boolean,
		default: false, // Ensure default is false
	},
});

module.exports = mongoose.model("Lecture", lectureSchema);
