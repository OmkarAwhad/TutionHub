const mongoose = require("mongoose");

const homeworkSubmissionSchema = new mongoose.Schema({
	homework: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Homework",
		required: true,
	},
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	fileUrl: {
		type: String,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
	isLate: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);
