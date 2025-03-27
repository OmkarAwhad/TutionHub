const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		enum: ["all", "students", "tutors", "subject"],
		required: true,
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
