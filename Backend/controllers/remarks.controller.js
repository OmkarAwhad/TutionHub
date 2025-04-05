const Remark = require("../models/remarks.model");
const User = require("../models/user.model");
const Subject = require("../models/subject.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.addARemark = async (req, res) => {
	try {
		const { studentId, subjectId, remark } = req.body;
		const tutorId = req.user.id;

		if (!studentId || !subjectId || !remark) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const subject = await Subject.findById(subjectId);
		if (!subject) {
			return res.json(new ApiError(404, "Subject not found"));
		}

		const student = await User.findById(studentId);
		if (!student || student.role !== "Student") {
			return res.json(new ApiError(404, "Student not found"));
		}

      if (!student.subjects.includes(subjectId)) {
         return res.json(new ApiError(400, "Student has not taken this subject"));
      }

		const newRemark = await Remark.create({
			student: studentId,
			tutor: tutorId,
			subject: subjectId,
			remark,
		});

		return res.json(
			new ApiResponse(200, newRemark, "Remark added successfully")
		);
	} catch (error) {
		console.log("Error adding remark: ", error);
		return res.json(
			new ApiError(500, "Error adding remark: " + error.message)
		);
	}
};

module.exports.viewRemarks = async (req, res) => {
	try {
		const studentId = req.user.id;

		const remarks = await Remark.find({ student: studentId })
			.populate("tutor", "name email")
			.populate("subject", "name code")
			.sort({ createdAt: -1 });

		if (remarks.length === 0) {
			return res.json(
				new ApiResponse(200, [], "No remarks found for the student")
			);
		}

		return res.json(
			new ApiResponse(200, remarks, "Remarks fetched successfully")
		);
	} catch (error) {
		console.log("Error fetching remarks: ", error);
		return res.json(
			new ApiError(500, "Error fetching remarks: " + error.message)
		);
	}
};

// module.exports.viewRemarkssForSubject = async (req, res) => {
// 	try {
// 		const { subjectId } = req.params;
// 		const tutorId = req.user.id;

// 		// Validate subject
// 		const subject = await Subject.findById(subjectId);
// 		if (!subject) {
// 			return res.json(new ApiError(404, "Subject not found"));
// 		}

// 		// Fetch remarks for the subject by the tutor
// 		const remarks = await Remark.find({
// 			subject: subjectId,
// 			tutor: tutorId,
// 		})
// 			.populate("student", "name email")
// 			.sort({ createdAt: -1 });

// 		if (remarks.length === 0) {
// 			return res.json(
// 				new ApiResponse(200, [], "No remarks found for the subject")
// 			);
// 		}

// 		return res.json(
// 			new ApiResponse(200, remarks, "Remarks fetched successfully")
// 		);
// 	} catch (error) {
// 		console.log("Error fetching remarks: ", error);
// 		return res.json(
// 			new ApiError(500, "Error fetching remarks: " + error.message)
// 		);
// 	}
// };
