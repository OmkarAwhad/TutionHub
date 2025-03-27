const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	// submittedTo: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "User", // Tutor
	// 	required: true,
	// },
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true,
	},
	comment: {
		type: String,
	},
	isAnonymous: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
