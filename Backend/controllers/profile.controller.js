const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
require("dotenv").config();

module.exports.getProfileDetails = async (req, res) => {
	try {
		const userId = req.user.id;
		// console.log("ID : ",id);

		const userDetails = await User.findById(userId)
			.populate("profile")
			.exec();

		return res.json(
			new ApiResponse(
				200,
				{ User: userDetails },
				"User/ Profile details fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching profile details ", error);
		return res.json(
			new ApiError(500, "Error in fetching profile details ")
		);
	}
};

module.exports.updateProfile = async (req, res) => {
	try {
		const { name, phoneNumber, gender } = req.body;
		const userId = req.user.id;

		const userDetails = await User.findById(userId);

		const profileDetails = await Profile.findById(userDetails.profile);

		profileDetails.phoneNumber = phoneNumber;
		profileDetails.gender = gender;

		await profileDetails.save();

		const updatedUserDetails = await User.findByIdAndUpdate(userId, {
			name: name,
		})
			.populate("profile")
			.exec();

		return res.json(
			new ApiResponse(
				201,
				{ User: updatedUserDetails },
				"Profile updated successfully"
			)
		);
	} catch (error) {
		console.log("Error in updating profile details ", error);
		return res.json(
			new ApiError(500, "Error in updating profile details ")
		);
	}
};
