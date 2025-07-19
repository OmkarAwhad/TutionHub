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
			.populate({
				path: "profile",
				populate: {
					path: "standard", // 👈 Populate standard details
					model: "Standard",
				},
			})
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
		const { name, phoneNumber, gender, standardId } = req.body; // 👈 Change to standardId
		const userId = req.user.id;

		const userDetails = await User.findById(userId)
			.populate("profile")
			.exec();
		if (!userDetails || !userDetails.profile) {
			return res.json(new ApiError(404, "User or profile not found"));
		}

		const profileDetails = await Profile.findById(
			userDetails.profile._id
		);

		profileDetails.phoneNumber = phoneNumber;
		profileDetails.gender = gender;
		profileDetails.standard = standardId; // 👈 Use standardId (ObjectId) not standardName

		await profileDetails.save();

		const updatedUserDetails = await User.findByIdAndUpdate(
			userId,
			{
				name: name,
			},
			{ new: true }
		)
			.populate({
				path: "profile",
				populate: {
					path: "standard",
					select: "standardName", // 👈 Add select to get standardName
				},
			})
			.exec();

		return res.json(new ApiResponse(201, { User: updatedUserDetails }));
	} catch (error) {
		// 👈 Add validation error handling
		if (error.name === "ValidationError") {
			const message = Object.values(error.errors)
				.map((err) => err.message)
				.join(", ");
			return res.json(new ApiError(400, `Validation Error: ${message}`));
		}

		console.log("Error in updating profile details ", error);
		return res.json(
			new ApiError(500, "Error in updating profile details ")
		);
	}
};

