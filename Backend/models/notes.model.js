const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
	},
	file: {
		type: String,
		required: true,
	},
	tutor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	uploadDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Note", noteSchema);
