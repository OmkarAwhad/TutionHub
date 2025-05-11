const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const User = require("../models/user.model");
const Attendance = require("../models/attendance.model");
const Marks = require("../models/marks.model");
const Lecture = require("../models/lecture.model");

module.exports.getMyStudentsList = async (req, res) => {
	try {
		// console.log(req.user)
		const userId = req.user.id;
		// console.log("1")

		const userDetails = await User.findById(userId)
			.populate("subjects")
			.exec();
		if (!userDetails.role === "Student") {
			return res.json(
				new ApiError(
					403,
					"Access denied. Only students can access this resource"
				)
			);
		}

		if (!userDetails) {
			return res.json(new ApiError(404, "User not found"));
		}

		// If user has subjects, fetch students for those subjects
		if (userDetails.subjects && userDetails.subjects.length > 0) {
			const subjectIds = userDetails.subjects.map(
				(subject) => subject._id
			);

			const students = await User.find({
				subjects: { $in: subjectIds },
				role: "Student",
			}).select("name email admissionDate subjects");

			if (!students || students.length === 0) {
				return res.json(
					new ApiResponse(200, [], "No students found")
				);
			}

			return res.json(
				new ApiResponse(
					200,
					students,
					"Students list fetched successfully"
				)
			);
		}

		// If no subjects found, return empty list
		return res.json(
			new ApiResponse(200, [], "No subjects found for this user")
		);
	} catch (error) {
		console.log("Error fetching students list: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching students list: " + error.message
			)
		);
	}
};

module.exports.viewStudentProfile = async (req, res) => {
	try {
		const { studentId } = req.params;

		if (!studentId) {
			return res.json(new ApiError(400, "Student ID is required"));
		}

		const studentDetails = await User.findById(studentId)
			.populate("subjects")
			.populate("homework")
			.populate("profile", "phoneNumber")
			.exec();

		if (!studentDetails) {
			return res.json(new ApiError(404, "Student not found"));
		}

		const attendanceDetails = await Attendance.find({
			student: studentId,
		});
		if (!attendanceDetails) {
			return res.json(
				new ApiError(404, "Student attendance not found")
			);
		}

		const marksDetails = await Marks.find({ student: studentId });
		if (!marksDetails) {
			return res.json(new ApiError(404, "Student marks not found"));
		}

		return res.json(
			new ApiResponse(
				200,
				{ studentDetails, attendanceDetails, marksDetails },
				"Student profile fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching student profile: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching student profile: " + error.message
			)
		);
	}
};

module.exports.getAllStudentsList = async (req, res) => {
	try {
		const students = await User.find({ role: "Student" }).select(
			"name email admissionDate subjects"
		);

		if (!students || students.length === 0) {
			return res.json(new ApiResponse(200, [], "No students found"));
		}

		return res.json(
			new ApiResponse(
				200,
				students,
				"All students list fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching all students list: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching all students list: " + error.message
			)
		);
	}
};

module.exports.getMyStudentsListByLec = async (req, res) => {
	try {
		const userId = req.user.id;
		const userDetails = await User.findById(userId);

		if (!userDetails) {
			return res.json(new ApiError(404, "User not found"));
		}

		if (userDetails.role === "Tutor") {
			return res.json(
				new ApiError(
					403,
					"Access denied. Only tutors can access this resource"
				)
			);
		}

		const { lectureId } = req.params;
		// console.log("Lecture ID : ",lectureId)
		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		const lectureDetails = await Lecture.findById(lectureId);
		if (!lectureDetails) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		const subjectId = lectureDetails.subject;
		if (!subjectId) {
			return res.json(
				new ApiError(
					400,
					"Lecture does not have an associated subject"
				)
			);
		}

		const studentsList = await User.find({
			subjects: { $in: [subjectId] },
			role: "Student",
		}).select("name email subjects");

		if (!studentsList || studentsList.length === 0) {
			return res.json(
				new ApiResponse(
					200,
					[],
					"No students found for the lecture"
				)
			);
		}

		return res.json(
			new ApiResponse(
				200,
				studentsList,
				"Students list for the lecture fetched successfully"
			)
		);
	} catch (error) {
		console.error("Error fetching students list by lecture: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching students list by lecture: " + error.message
			)
		);
	}
};

module.exports.getTutors = async (req, res) => {
	try {
		const tutorDetails = await User.find({ role: "Tutor" })
			.populate("profile")
			.exec();
		if (!tutorDetails || tutorDetails.length === 0) {
			return res.json(new ApiResponse(200, [], "No tutors found"));
		}

		return res.json(
			new ApiResponse(
				200,
				tutorDetails,
				"Tutors list fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching tutors list: ", error);
		return res.json(
			new ApiError(500, "Error fetching tutors list: " + error.message)
		);
	}
};

module.exports.getMyDetails = async (req, res) => {
	try {
		const userId = req.user.id;
		const userDetails = await User.findById(userId)
			.populate({
				path: "notes",
				populate: [
					{ path: "subject", select: "name code" },
					{ path: "tutor", select: "name email" },
				],
			})
			.populate({
				path: "announcement",
				populate: [
					{ path: "subject", select: "name code" },
					{ path: "createdBy", select: "name email" },
				],
			})
			.populate("profile")
			.populate("subjects")
			.populate({
				path: "homework",
				populate: [
					{ path: "subject", select: "name code" },
					{ path: "tutor", select: "name email" },
				],
			})
			.exec();
		if (!userDetails) {
			return res.json(new ApiError(400, "Your details not found"));
		}
		return res.json(
			new ApiResponse(200, userDetails, "My Details fetched")
		);
	} catch (error) {
		console.log("Error fetching my details: ", error);
		return res.json(
			new ApiError(500, "Error fetching my details: " + error.message)
		);
	}
};
