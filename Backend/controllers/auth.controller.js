const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
require("dotenv").config();
const Profile = require("../models/profile.model");

module.exports.signUp = async (req, res) => {
	try {
		const { name, email, password, confirmPassword, role } = req.body;
		if (!name || !email || !password || !confirmPassword || !role) {
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
			standard:null,
		});

		const userData = await User.create({
			name,
			email,
			password: hashedPassword,
			role,
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
