const Lecture = require("../models/lecture.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createLecture = async (req, res) => {
	try {
		const { date, time, tutor, subject, description } = req.body;

		if (!date || !time || !tutor || !subject || !description) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const lectureExists = await Lecture.findOne({
			date: date,
			time: time,
		});
		if (lectureExists) {
			return res.json(
				new ApiError(
					400,
					"Lecture already exists at the given date and time"
				)
			);
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

		const dayOfWeek = inputDate.toLocaleString("en-US", {
			weekday: "long",
		});

		const lectureDetails = await Lecture.create({
			date: inputDate,
			time: time,
			tutor: tutorDetails._id,
			subject: subjectDetails._id,
			day: dayOfWeek,
			description: description,
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

module.exports.getLecturesOfWeek = async (req, res) => {
	try {
		const weekStart = new Date();
		weekStart.setHours(0, 0, 0, 0);
		weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sets date to the start of the week (Sunday)

		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekEnd.getDate() + 6);
		weekEnd.setHours(23, 59, 59, 999);

		const lectures = await Lecture.find({
			date: {
				$gte: weekStart, // Greater than or equal to week start
				$lte: weekEnd, // Less than or equal to week end
			},
		})
			.populate("tutor")
			.populate("subject")
			.exec();

		const lectByDay = {
			Sunday: [],
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
		};

		lectures.forEach((lect) => {
			const day = lect.day;
			if (lectByDay[day]) {
				lectByDay[day].push({
					_id: lect._id,
					student: lect.student,
					tutor: lect.tutor,
					date: lect.date,
					day: lect.day,
					description: lect.description,
				});
			}
		});

		return res.json(
			new ApiResponse(
				200,
				{
					weekStart: weekStart.toISOString().split("T")[0],
					weekEnd: weekEnd.toISOString().split("T")[0],
					lectures: lectByDay,
				},
				"Lectures fetched and grouped by day for the week successfully"
			)
		);
	} catch (error) {
		console.log("Error in getting all lectures of a week ", error);
		return res.json(
			new ApiError(500, "Error in getting all lectures of a week ")
		);
	}
};

module.exports.getLectByDesc = async (req, res) => {
	try {
		const { description } = req.query; // Read from query parameters

		if (!description) {
			return res.json(new ApiError(400, "Description is required"));
		}

		const details = await Lecture.find({ description })
			.populate("tutor")
			.populate("subject")
			.exec();

		return res.json(
			new ApiResponse(
				200,
				details,
				"Test days fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching Test days schedule ", error);
		return res.json(
			new ApiError(500, "Error fetching Test days schedule ")
		);
	}
};

module.exports.updateLecture = async (req, res) => {
	try {
		const { lectureId } = req.params;
		const { date, time, tutor, subject, description } = req.body;

		const lecture = await Lecture.findById(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		if (date) {
			const inputDate = new Date(date);
			const todaysDate = new Date();
			todaysDate.setHours(0, 0, 0, 0);

			if (inputDate < todaysDate) {
				return res.json(
					new ApiError(400, "Date cannot be in the past")
				);
			}
			lecture.date = inputDate;
			lecture.day = inputDate.toLocaleString("en-US", {
				weekday: "long",
			});
		}

		if (time) lecture.time = time;
		if (tutor) {
			const tutorDetails = await User.findById(tutor);
			if (!tutorDetails) {
				return res.json(new ApiError(404, "Tutor not found"));
			}
			lecture.tutor = tutorDetails._id;
		}
		if (subject) {
			const subjectDetails = await Subject.findById(subject);
			if (!subjectDetails) {
				return res.json(new ApiError(404, "Subject not found"));
			}
			lecture.subject = subjectDetails._id;
		}
		if (description) lecture.description = description;

		await lecture.save();

		return res.json(
			new ApiResponse(200, lecture, "Lecture updated successfully")
		);
	} catch (error) {
		console.log("Error in updating lecture: ", error);
		return res.json(new ApiError(500, "Error in updating lecture"));
	}
};

module.exports.deleteLecture = async (req, res) => {
	try {
		const { lectureId } = req.body;

		const lecture = await Lecture.findByIdAndDelete(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		return res.json(
			new ApiResponse(200, null, "Lecture deleted successfully")
		);
	} catch (error) {
		console.log("Error in deleting lecture: ", error);
		return res.json(new ApiError(500, "Error in deleting lecture"));
	}
};

module.exports.getAllLectures = async (req, res) => {
	try {
		const lectures = await Lecture.find()
			.populate("tutor")
			.populate("subject")
			.sort({ date: -1, time: 1 });

		return res.json(
			new ApiResponse(
				200,
				lectures,
				"All lectures fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in getting all lectures: ", error);
		return res.json(new ApiError(500, "Error in getting all lectures"));
	}
};

module.exports.getLectureBySub = async (req, res) => {
	try {
		const { subjectId } = req.query;

		if (!subjectId) {
			return res.json(new ApiError(400, "Subject ID is required"));
		}

		const lectureDetails = await Lecture.find({ subject: subjectId })
			.populate("tutor")
			.populate("subject")
			.sort({ date: -1, time: 1 })
			.exec();

		if (!lectureDetails || lectureDetails.length === 0) {
			return res.json(
				new ApiResponse(200, [], "No lectures found for this subject")
			);
		}

		return res.json(
			new ApiResponse(
				200,
				lectureDetails,
				"Lectures fetched successfully for the given subject"
			)
		);
	} catch (error) {
		console.log("Error in getting all lectures by subject: ", error);
		return res.json(
			new ApiError(500, "Error in getting all lectures by subject")
		);
	}
};
