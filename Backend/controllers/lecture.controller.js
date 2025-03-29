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

		const lectureExists = await Lecture.find({ date: date, time: time });
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

module.exports.getLecturesByDay = async (req, res) => {
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
