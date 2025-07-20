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
	standard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Standard",
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

lectureSchema.pre("save", function (next) {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	this.day = days[new Date(this.date).getDay()];
	next();
});

module.exports = mongoose.model("Lecture", lectureSchema);
