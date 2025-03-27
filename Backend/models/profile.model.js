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
});

module.exports = mongoose.model("Profile", profileSchema);
