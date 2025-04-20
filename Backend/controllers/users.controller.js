const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const User = require("../models/user.model");
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

		const student = await User.findById(studentId)
			.populate("subjects", "name code")
			.select("name email subjects");

		if (!student) {
			return res.json(new ApiError(404, "Student not found"));
		}

		return res.json(
			new ApiResponse(
				200,
				student,
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
