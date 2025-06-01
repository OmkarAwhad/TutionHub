const Attendance = require("../models/attendance.model");
const Lecture = require("../models/lecture.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const mongoose = require("mongoose");

module.exports.markAttendance = async (req, res) => {
	try {
		const { lectureId, studentId, status } = req.body;

		const lectureDetails = await Lecture.findById(lectureId);
		if (!lectureDetails) {
			return res.json(new ApiError(400, "Lecture not found"));
		}

		if (lectureDetails.date > Date.now()) {
			return res.json(
				new ApiError(
					400,
					"Cannot mark attendance for a future lecture"
				)
			);
		}

		const studentDetails = await User.findById(studentId);
		if (!studentDetails) {
			return res.json(new ApiError(400, "Student not found"));
		}

		const attendanceDetails = await Attendance.create({
			status,
			lecture: lectureId,
			student: studentId,
		});

		// Update the lecture's isMarked field to true
		await Lecture.findByIdAndUpdate(lectureId, { isMarked: true });

		return res.json(
			new ApiResponse(
				200,
				{
					attendanceDetails: attendanceDetails,
					LectureDate: lectureDetails.date,
				},
				"Attendance marked successfully"
			)
		);
	} catch (error) {
		console.log("Error in marking attendance ", error);
		return res.json(new ApiError(500, "Error in marking attendance "));
	}
};

module.exports.viewAttendanceOfAStud = async (req, res) => {
	try {
		const userId = req.user.id;

		const userDetails = await User.findById(userId);
		const subjectIds = userDetails.subjects.map((elm) => elm._id);

		const lectureDetails = await Lecture.find({
			subject: { $in: subjectIds },
		});

		if (!lectureDetails || lectureDetails.length === 0) {
			return res.json(
				new ApiError(
					400,
					"No lectures found for the student's subjects"
				)
			);
		}

		const attendanceDetails = await Attendance.find({ student: userId })
			.populate("lecture")
			.exec();

		const totalLectures = lectureDetails.length;
		const presentCount = attendanceDetails.filter(
			(att) => att.status === "Present"
		).length;
		const absentCount = attendanceDetails.filter(
			(att) => att.status === "Absent"
		).length;
		const unrecordedCount = totalLectures - (presentCount + absentCount);
		const percentage =
			totalLectures > 0
				? (presentCount / (totalLectures - unrecordedCount)) * 100
				: 0;

		return res.json(
			new ApiResponse(
				200,
				{
					attendanceDetails,
					statistics: {
						totalLectures,
						present: presentCount,
						absent: absentCount,
						unrecorded: unrecordedCount,
						markedLectures: totalLectures - unrecordedCount,
						percentage: percentage.toFixed(2) + "%",
					},
				},
				"Student attendance fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching student attendance ", error);
		return res.json(
			new ApiError(500, "Error in fetching student attendance ")
		);
	}
};

module.exports.attendAccToSub = async (req, res) => {
	try {
		const userId = req.user.id;
		const { subjectId } = req.params; // Changed to params

		const isSubjectTakenByStud = await User.findOne({
			subjects: { $in: [subjectId] },
		});
		if (!isSubjectTakenByStud) {
			return res.json(
				new ApiError(
					400,
					"Student is not enrolled in the specified subject"
				)
			);
		}

		const lectureDetails = await Lecture.find({ subject: subjectId });
		if (!lectureDetails || lectureDetails.length === 0) {
			return res.json(
				new ApiError(400, "No lectures found for this subject")
			);
		}

		const lectureIds = lectureDetails.map((lect) => lect._id);

		const attendanceDetails = await Attendance.find({
			student: userId,
			lecture: { $in: lectureIds },
		}).populate({ path: "lecture", populate: "subject" });

		const totalLectures = lectureDetails.length; // Include all lectures
		const presentCount = attendanceDetails.filter(
			(att) => att.status === "Present"
		).length;
		const absentCount = attendanceDetails.filter(
			(att) => att.status === "Absent"
		).length;
		const unrecordedCount = totalLectures - (presentCount + absentCount);
		const percentage =
			totalLectures > 0
				? (presentCount / (totalLectures - unrecordedCount)) * 100
				: 0;

		return res.json(
			new ApiResponse(
				200,
				{
					attendanceDetails,
					statistics: {
						totalLectures,
						present: presentCount,
						absent: absentCount,
						unrecorded: unrecordedCount,
						markedLectures: totalLectures - unrecordedCount,
						percentage: percentage.toFixed(2) + "%",
					},
				},
				"Attendance fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching attendance acc to a subject ", error);
		return res.json(
			new ApiError(
				500,
				"Error in fetching attendance acc to a subject "
			)
		);
	}
};

module.exports.StudAttendAccToSubForTutor = async (req, res) => {
	try {
		const { studentId, subjectId } = req.body;

		const userDetails = await User.findOne({
			subjects: { $in: [subjectId] },
		});
		if (!userDetails) {
			return res.json(
				new ApiError(
					400,
					"Student is not enrolled in the specified subject"
				)
			);
		}

		const lectureDetails = await Lecture.find({ subject: subjectId });
		if (!lectureDetails || lectureDetails.length === 0) {
			return res.json(
				new ApiError(400, "No lectures found for this subject")
			);
		}

		const lectureIds = lectureDetails.map((lect) => lect._id);

		const attendanceDetails = await Attendance.find({
			student: studentId,
			lecture: { $in: lectureIds },
		})
			.populate({ path: "lecture", populate: "subject" })
			.populate("student", "name")
			.exec();

		const totalLectures = lectureDetails.length; // Include all lectures
		const presentCount = attendanceDetails.filter(
			(att) => att.status === "Present"
		).length;
		const absentCount = attendanceDetails.filter(
			(att) => att.status === "Absent"
		).length;
		const unrecordedCount = totalLectures - (presentCount + absentCount);
		const percentage =
			totalLectures > 0
				? (presentCount / (totalLectures - unrecordedCount)) * 100
				: 0;

		return res.json(
			new ApiResponse(
				200,
				{
					// userDetails,
					attendanceDetails,
					statistics: {
						totalLectures,
						present: presentCount,
						absent: absentCount,
						unrecorded: unrecordedCount,
						markedLectures: totalLectures - unrecordedCount,
						percentage: percentage.toFixed(2) + "%",
					},
				},
				"Attendance fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching attendance acc to a subject ", error);
		return res.json(
			new ApiError(
				500,
				"Error in fetching attendance acc to a subject "
			)
		);
	}
};

module.exports.viewStudAttendanceForLec = async (req, res) => {
	try {
		if (req.user.role === "Student") {
			return res.json(
				new ApiError(
					400,
					"This is a protected route for admin and tutor"
				)
			);
		}
		const { lectureId } = req.query;
		const attendanceDetails = await Attendance.find({
			lecture: lectureId,
		})
			.populate("student", "name")
			.exec();

		return res.json(
			new ApiResponse(
				200,
				attendanceDetails,
				"Attendance according to a lecture fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching attendance by lecture ", error);
		return res.json(
			new ApiError(500, "Error in fetching attendance by lecture ")
		);
	}
};

module.exports.studsPresentForALec = async (req, res) => {
	try {
		const { lectureId } = req.query;
		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		const attendanceDetails = await Attendance.find({
			lecture: lectureId,
		})
			.populate("student")
			.exec();

		if (!attendanceDetails || attendanceDetails.length === 0) {
			return res.json(
				new ApiError(
					400,
					"No attendance records found for the given lecture"
				)
			);
		}

		const finalResult = attendanceDetails.filter(
			(student) => student.status === "Present"
		);

		return res.json(
			new ApiResponse(
				200,
				finalResult,
				"List of students present for the lecture fetched successfully"
			)
		);
	} catch (error) {
		console.log(
			"Error in fetching all present students details for that lecture  ",
			error
		);
		return res.json(
			new ApiError(
				500,
				"Error in fetching all present students details for that lecture  "
			)
		);
	}
};

module.exports.checkLectureAttendance = async (req, res) => {
	try {
		const { lectureId } = req.params;

		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		const attendanceExists = await Attendance.find({
			lecture: lectureId,
		})
			.populate("student")
			.populate("lecture")
			.exec();

		return res.json(
			new ApiResponse(
				200,
				{ attendanceMarked: !!attendanceExists },
				"Attendance status checked successfully"
			)
		);
	} catch (error) {
		console.log("Error checking lecture attendance: ", error);
		return res.json(
			new ApiError(
				500,
				"Error checking lecture attendance: " + error.message
			)
		);
	}
};

module.exports.getLecturesWithAttendanceMarked = async (req, res) => {
	try {
		const attendanceRecords = await Attendance.find().distinct("lecture");

		const lectures = await Lecture.find({
			_id: { $in: attendanceRecords },
		})
			.populate("subject")
			.populate("tutor")
			.sort({ date: -1 });

		return res.json(
			new ApiResponse(
				200,
				lectures,
				"Lectures with attendance marked fetched successfully"
			)
		);
	} catch (error) {
		console.log(
			"Error in fetching lectures with attendance marked: ",
			error
		);
		return res.json(
			new ApiError(
				500,
				"Error in fetching lectures with attendance marked: " +
					error.message
			)
		);
	}
};

module.exports.getLecturesWithoutAttendance = async (req, res) => {
	try {
		const allLectures = await Lecture.find()
			.populate("subject")
			.populate("tutor")
			.sort({ date: -1 });

		const lecturesWithAttendance = await Attendance.find().distinct(
			"lecture"
		);

		const lecturesWithoutAttendance = allLectures.filter(
			(lecture) =>
				!lecturesWithAttendance.includes(lecture._id.toString())
		);

		return res.json(
			new ApiResponse(
				200,
				lecturesWithoutAttendance,
				"Lectures without attendance marked fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching lectures without attendance: ", error);
		return res.json(
			new ApiError(
				500,
				"Error in fetching lectures without attendance: " +
					error.message
			)
		);
	}
};
