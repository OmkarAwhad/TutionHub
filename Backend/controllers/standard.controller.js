const Standard = require("../models/standard.model");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
require("dotenv").config();

module.exports.getAllStandards = async (req, res) => {
	try {
		const standards = await Standard.find({}).exec();

		return res.json(
			new ApiResponse(
				200,
				{ standards: standards },
				"Standards fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching standards ", error);
		return res.json(new ApiError(500, "Error in fetching standards "));
	}
};

module.exports.assignStandardToStudent = async (req, res) => {
	try {
		const { studentId, standardId } = req.body;

		if (!studentId || !standardId) {
			return res.json(
				new ApiError(400, "Student ID and Standard ID are required")
			);
		}

		const student = await User.findById(studentId);
		if (!student) {
			return res.json(new ApiError(404, "Student not found"));
		}

		if (student.role !== "Student") {
			return res.json(new ApiError(400, "User is not a student"));
		}

		const standard = await Standard.findById(standardId);
		if (!standard) {
			return res.json(new ApiError(404, "Standard not found"));
		}

		if (!student.profile) {
			return res.json(new ApiError(400, "Student profile not found"));
		}

		await Profile.findByIdAndUpdate(
			student.profile,
			{ standard: standardId },
			{ new: true }
		);

		const updatedStudent = await User.findById(studentId)
			.populate({
				path: "profile",
				populate: {
					path: "standard",
					select: "standardName",
				},
			})
			.select("name email profile");

		return res.json(
			new ApiResponse(
				200,
				{ student: updatedStudent },
				"Standard assigned successfully"
			)
		);
	} catch (error) {
		console.log("Error in assigning standard: ", error);
		return res.json(
			new ApiError(
				500,
				"Error in assigning standard: " + error.message
			)
		);
	}
};

module.exports.createStandard = async (req, res) => {
	try {
		const { standardName } = req.body;

		if (!standardName) {
			return res.json(new ApiError(400, "Standard name is required"));
		}

		const newStandard = await Standard.create({ standardName });

		return res.json(
			new ApiResponse(
				201,
				{ standard: newStandard },
				"Standard created successfully"
			)
		);
	} catch (error) {
		if (error.name === "ValidationError") {
			const message = Object.values(error.errors)
				.map((err) => err.message)
				.join(", ");
			return res.json(
				new ApiError(400, `Validation Error: ${message}`)
			);
		}

		console.log("Error in creating standard ", error);
		return res.json(new ApiError(500, "Error in creating standard"));
	}
};

module.exports.getStandardById = async (req, res) => {
	try {
		const { id } = req.params;

		const standard = await Standard.findById(id).exec();

		if (!standard) {
			return res.json(new ApiError(404, "Standard not found"));
		}

		return res.json(
			new ApiResponse(
				200,
				{ standard: standard },
				"Standard fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching standard ", error);
		return res.json(new ApiError(500, "Error in fetching standard "));
	}
};

module.exports.getMyStandard = async (req, res) => {
	try {
		const userId = req.user.id;

		const user = await User.findById(userId).populate({
			path: "profile",
		});

		if (!user || !user.profile) {
			return res.json(new ApiError(404, "Profile not found"));
		}

		console.log("user.profile.standard : ",user.profile)

		if (!user.profile) {
			return res.json(new ApiError(404, "Standard not assigned"));
		}

		return res.json(
			new ApiResponse(
				200,
				{ standard: user.profile.standard },
				"Standard fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching my standard ", error);
		return res.json(new ApiError(500, "Error in fetching my standard"));
	}
};
