const mongoose = require("mongoose");

const RemarksSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	}, // Student being remarked on
	tutor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	}, // Tutor making the remark
	subject: {
		type: String,
		required: true,
	}, // Subject context
	remark: {
		type: String,
		required: true,
	}, // Text of the remark
	createdAt: {
		type: Date,
		default: Date.now,
	}, // Timestamp
});

module.exports = mongoose.model("Remark", RemarksSchema);
