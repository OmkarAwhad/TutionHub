const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const User = require("../models/user.model");
const Lecture = require("../models/lecture.model");

module.exports.getStudentsList = async (req, res) => {
	try {
		const userId = req.user.id;

		const userDetails = await User.findById(userId).populate('subject').exec();
      const subjectId = userDetails.subjects[0];

		let students;

		if (subjectId) {
			students = await User.find({
				subjects: subjectId,
				role: "Student",
			}).select("name email admissionDate");
		} else if (lectureId) {
			const lecture = await Lecture.findById(lectureId).populate(
				"subject"
			);

			if (!lecture) {
				return res.json(new ApiError(404, "Lecture not found"));
			}

			students = await User.find({
				subjects: lecture.subject._id,
				role: "Student",
			}).select("name email admissionDate");
		}

		if (!students || students.length === 0) {
			return res.json(new ApiResponse(200, [], "No students found"));
		}

		return res.json(
			new ApiResponse(
				200,
				students,
				"Students list fetched successfully"
			)
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
