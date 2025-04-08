const Announcement = require("../models/announcement.model");
const User = require("../models/user.model");
const Subject = require("../models/subject.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createAnnouncement = async (req, res) => {
	try {
		const { message, target, subject } = req.body;

		if (!message || !target) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		let targetUsers;
		if (target === "Students") targetUsers = "Student";
		else if (target === "Tutors") targetUsers = "Tutor";
		else if (target === "All") targetUsers = "All";

		let subjectDetails;
		if (subject) {
			subjectDetails = await Subject.findById(subject);
			if (!subjectDetails) {
				return res.json(new ApiError(400, "Subject not found"));
			}
		}

		let query = {};
		if (targetUsers === "All") {
			query.role = { $in: ["Student", "Tutor"] };
		} else {
			query.role = targetUsers;
		}
		if (subject) {
			query.subjects = { $in: [subject] };
		}

		const targetedUserIDs = await User.find(query);

		if (targetedUserIDs.length === 0) {
			return res.json(
				new ApiError(
					404,
					"No users found for the specified subject"
				)
			);
		}

		// for (const user of targetedUserIDs) {
		// 	await User.findByIdAndUpdate(
		// 		user._id,
		// 		{
		// 			$addToSet: {
		// 				announcement:  announcementDetails._id ,
		// 			},
		// 		},
		// 		{ new: true }
		// 	);
		// }

		const announcementDetails = await Announcement.create({
			message: message,
			target: target,
			subject: subject ? subject : null,
			createdBy: req.user.id,
		});

		await User.updateMany(
			{ _id: { $in: targetedUserIDs.map((user) => user._id) } },
			{
				$addToSet: {
					announcement: announcementDetails._id,
				},
			}
		);

		return res.json(
			new ApiResponse(
				200,
				announcementDetails,
				"Announcement created successfully"
			)
		);
	} catch (error) {
		console.log("Error creating announcement: ", error);
		return res.json(
			new ApiError(
				500,
				"Error creating announcement: " + error.message
			)
		);
	}
};

module.exports.getAnnouncements = async (req, res) => {
	try {
		const userId = req.user.id;
		console.log(userId)
		const userDetails = await User.findById(userId).populate("announcement").exec();
		return res.json(
			new ApiResponse(
				200,
				userDetails,
				"Announcements fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching announcements: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching announcements: " + error.message
			)
		);
	}
};

module.exports.deleteAnnouncement = async (req, res) => {
	try {
		const { announcementId } = req.body;

		const announcementDetails = await Announcement.findById(
			announcementId
		);
		if (!announcementDetails) {
			return res.json(new ApiError(400, "Announcement not found"));
		}

		await User.updateMany(
			{ announcement: { $in: [announcementId] } },
			{
				$pull: {
					announcement: announcementId,
				},
			}
		);

		await Announcement.findByIdAndDelete(announcementId);

		return res.json(
			new ApiResponse(200, {}, "Announcement deleted successfully")
		);
	} catch (error) {
		console.log("Error deleting announcement ", error);
		return res.json(
			new ApiError(500, "Error deleting announcement " + error.message)
		);
	}
};
