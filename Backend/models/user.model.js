const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		enum: ["Student", "Tutor", "Admin"],
		type: String,
	},
	admissionDate: {
		type: Date,
	},
	profile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Profile",
	},
	subjects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subject",
		},
	],
	// progress: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Progress",
	// },
	/// Nahi chahiye kyuki progress mein humne studentId access kar rakha h
});

module.exports = mongoose.model("User", userSchema);
