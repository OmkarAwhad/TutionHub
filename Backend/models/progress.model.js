const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	subject: {
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
	updatedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	description: {
		type: String,
	},
});

module.exports = mongoose.model("Progress", ProgressSchema);
