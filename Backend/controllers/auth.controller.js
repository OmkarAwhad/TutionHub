const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
require("dotenv").config();
const Profile = require("../models/profile.model");
const otpGenerator = require("otp-generator");
const OTP = require("../models/otp.model");

module.exports.signUp = async (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body;
		if (!name || !email || !password || !confirmPassword) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const userDetails = await User.findOne({ email: email });
		if (userDetails) {
			return res.json(new ApiError(400, "User already exists"));
		}

		if (password !== confirmPassword) {
			return res.json(
				new ApiError(400, "Both Passwords doesn't match")
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const profileDetails = await Profile.create({
			gender: null,
			phoneNumber: null,
			allFeesPaid: false,
			standard: null,
		});

		const userData = await User.create({
			name,
			email,
			password: hashedPassword,
			role: "Student",
			profile: profileDetails._id,
		});

		return res.json(
			new ApiResponse(
				200,
				{ User: userData },
				"User registration successful"
			)
		);
	} catch (err) {
		console.log("Error in signUp", err);
		return res.json(new ApiError(500, "Error in signup"));
	}
};

module.exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const userDetails = await User.findOne({ email: email })
			.populate("profile")
			.populate("notes")
			.populate("announcement")
			.populate("subjects")
			.exec();

		if (!userDetails) {
			return res.json(
				new ApiError(
					400,
					"User does not exist, Please sign up first "
				)
			);
		}

		// if(userDetails.role !== role){
		// 	return res.json(new ApiError(400,"Role of the user didn't matched"))
		// }

		if (!(await bcrypt.compare(password, userDetails.password))) {
			return res.json(new ApiError(400, "Invalid password"));
		}

		const token = jwt.sign(
			{
				id: userDetails._id,
				email: userDetails.email,
				role: userDetails.role,
			},
			process.env.JWT_SECRET
		);
		userDetails.token = token;
		userDetails.password = undefined;

		return res
			.cookie("token", token)
			.json(
				new ApiResponse(
					200,
					{ User: userDetails, token },
					"Login successful"
				)
			);
	} catch (error) {
		console.log("Error in login ", error);
		return res.json(new ApiError(500, "Error in login "));
	}
};

module.exports.removeUser = async (req, res) => {
	try {
		const { userId } = req.body;
		await User.findByIdAndDelete(userId);

		return res.json(
			new ApiResponse(200, {}, "User deleted successfully")
		);
	} catch (error) {
		console.log("Error in removing the user ", error);
		return res.json(new ApiError(500, "Error in removing the user "));
	}
};

module.exports.deleteMyAccount = async (req, res) => {
	try {
		const userId = req.user.id;
		await User.findByIdAndDelete(userId);
		return res.json(
			new ApiResponse(
				200,
				{},
				"Your account has been deleted successfully"
			)
		);
	} catch (error) {
		console.log("Error in deleting my account ", error);
		return res.json(new ApiError(500, "Error in deleting my account "));
	}
};

module.exports.forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const checkUserPresent = await User.findOne({ email: email });
		if (!checkUserPresent) {
			return res.status(404).json({
				success: false,
				message: "User does not exist",
			});
		}

		const otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const otpDocument = new OTP({
			email,
			otp,
		});

		await otpDocument.save();

		return res.status(200).json({
			success: true,
			message: "OTP sent successfully to your email",
		});
	} catch (error) {
		console.error("Error in forget password:", error);
		return res.status(500).json({
			success: false,
			message: "Error in sending OTP",
		});
	}
};

module.exports.verifyOTP = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email and OTP are required",
			});
		}

		const otpDocument = await OTP.findOne({ email, otp });

		if (!otpDocument) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired OTP",
			});
		}

		const userDetails = await User.findOne({ email });
		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		await OTP.deleteOne({ _id: otpDocument._id });

		const resetToken = jwt.sign(
			{ id: userDetails._id, email: email },
			process.env.JWT_SECRET
		);

		return res.status(200).json({
			success: true,
			message: "OTP verified successfully",
			resetToken,
		});
	} catch (error) {
		console.error("Error in OTP verification:", error);
		return res.status(500).json({
			success: false,
			message: "Error in verifying OTP",
		});
	}
};

module.exports.changePassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		if (!newPassword) {
			return res.status(400).json({
				success: false,
				message: "New password is required",
			});
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired token",
			});
		}

		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;
		await user.save();

		return res.status(200).json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (error) {
		console.error("Error in changing password:", error);
		return res.status(500).json({
			success: false,
			message: "Error in changing password",
		});
	}
};
