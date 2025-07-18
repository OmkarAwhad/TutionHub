const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	phoneNumber: {
		type: String,
	},
	gender: {
		type: String,
	},
	allFeesPaid: {
		type: Boolean,
	},
	standard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Standard",
	},
});

module.exports = mongoose.model("Profile", profileSchema);
