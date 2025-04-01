const Feedback = require("../models/feedback.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.makeAFeedback = async (req, res) => {
	try {
		const { comment, isAnonymous } = req.body;
		const userId = req.user.id;

		const feedbackDetails = await Feedback.create({
			student: userId,
			comment,
			isAnonymous,
		});

		return res.json(
			new ApiResponse(
				200,
				feedbackDetails,
				"Feedback created successfully"
			)
		);
	} catch (error) {
		console.log("Error in posting the feedback ", error);
		return res.json(new ApiError(500, "Error in posting the feedback"));
	}
};

module.exports.myFeedbacks = async (req, res) => {
	try {
		const userId = req.user.id;

		const feedbackDetails = await Feedback.find({ student: userId }).sort(
			{
				createdAt: -1,
			}
		);
		return res.json(
			new ApiResponse(
				200,
				feedbackDetails,
				"All Feedbacks fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching my feedbacks ", error);
		return res.json(new ApiError(500, "Error in fetching my feedbacks"));
	}
};

module.exports.allFeedbacks = async (req, res) => {
	try {
		const feedbacks = await Feedback.find()
			.populate("student", "name email")
			.sort({ createdAt: -1 });

		const sanitizedFeedbacks = feedbacks.map((feedback) => {
			if (feedback.isAnonymous) {
				return {
					...feedback.toObject(),
					student: { name: "Anonymous", email: null },
				};
			}
			return feedback;
		});

		return res.json(
			new ApiResponse(
				200,
				sanitizedFeedbacks,
				"All Feedbacks fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching all the student feedbacks ", error);
		return res.json(
			new ApiError(500, "Error in fetching all the student feedbacks")
		);
	}
};
