const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	lecture: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Lecture",
		required: true,
	},
	subject:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
		required: true,
	},
	marks: {
		type: Number,
		required: true,
	},
	totalMarks: {
		type: Number,
	},
	description: {
		type: String,
	},
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Marks", MarksSchema);
