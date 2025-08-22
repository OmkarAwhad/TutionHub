const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender.utils");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		expires: 5 * 60 * 1000,
	},
});

const sendVerificationEmail = async (email, otp) => {
	try {
		const response = await mailSender(
			email,
			"Verification Email from StudyNotion",
			otp
		);
		console.log("Mail sent successfully ", response);
	} catch (error) {
		console.log("Error occured while verifying and sending email");
	}
};

OTPSchema.pre("save", async function (next) {
	await sendVerificationEmail(this.email, this.otp);
	next();
});

module.exports = mongoose.model("OTP", OTPSchema);
