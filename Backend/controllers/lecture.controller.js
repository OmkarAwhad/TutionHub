const Lecture = require("../models/lecture.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createLecture = async (req, res) => {
	try {
		const { date, time, tutor, subject } = req.body;

		if (!date || !time || !tutor || !subject) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const inputDate = new Date(date);
		const todaysDate = new Date();
		todaysDate.setHours(0, 0, 0, 0);

		if (inputDate < todaysDate) {
			return res.json(new ApiError(400, "Date cannot be in the past"));
		}

		const tutorDetails = await User.findById(tutor);
		if (!tutorDetails) {
			return res.json(new ApiError(404, "Tutor not found"));
		}

		const subjectDetails = await Subject.findById(subject);
		if (!subjectDetails) {
			return res.json(new ApiError(404, "Subject not found"));
		}

		const lectureDetails = await Lecture.create({
			date: inputDate,
			time: time,
			tutor: tutorDetails._id,
			subject: subjectDetails._id,
		});

		return res.json(
			new ApiResponse(
				201,
				lectureDetails,
				"Lecture created successfully"
			)
		);
	} catch (error) {
		console.log("Error in creating a lecture ", error);
		return res.json(new ApiError(500, "Error in creating a lecture "));
	}
};

module.exports.getLecturesOfAWeek = async(req,res) => {
   try {
      
   } catch (error) {
      console.log("Error in getting all lectures of a week ", error);
		return res.json(new ApiError(500, "Error in getting all lectures of a week "));
   }
}
