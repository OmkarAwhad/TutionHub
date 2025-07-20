const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		enum: ["All", "Students", "Tutors"],
		required: true,
	},
	standard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Standard",
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
