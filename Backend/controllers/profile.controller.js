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
