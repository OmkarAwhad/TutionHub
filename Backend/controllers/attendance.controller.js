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

		// Use a Set to track unique lecture IDs for which attendance is marked
		const markedLectureIds = new Set();
		let presentCount = 0;
		let absentCount = 0;

		attendanceDetails.forEach((att) => {
			if (att.lecture && att.lecture._id) {
				const lectId = att.lecture._id.toString();
				if (!markedLectureIds.has(lectId)) {
					markedLectureIds.add(lectId);
					if (att.status === "Present") presentCount++;
					else if (att.status === "Absent") absentCount++;
				}
			}
		});

		const markedLectures = markedLectureIds.size;
		const unrecordedCount = totalLectures - markedLectures;
		const percentage =
			markedLectures > 0
				? (presentCount / markedLectures) * 100
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
						markedLectures: markedLectures,
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

		const totalLectures = lectureDetails.length;

		// Use a Set to track unique lecture IDs for which attendance is marked
		const markedLectureIds = new Set();
		let presentCount = 0;
		let absentCount = 0;

		attendanceDetails.forEach((att) => {
			if (att.lecture && att.lecture._id) {
				const lectId = att.lecture._id.toString();
				if (!markedLectureIds.has(lectId)) {
					markedLectureIds.add(lectId);
					if (att.status === "Present") presentCount++;
					else if (att.status === "Absent") absentCount++;
				}
			}
		});

		const markedLectures = markedLectureIds.size;
		const unrecordedCount = totalLectures - markedLectures;
		const percentage =
			markedLectures > 0
				? (presentCount / markedLectures) * 100
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
						markedLectures: markedLectures,
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

		const totalLectures = lectureDetails.length;

		// Use a Set to track unique lecture IDs for which attendance is marked
		const markedLectureIds = new Set();
		let presentCount = 0;
		let absentCount = 0;

		attendanceDetails.forEach((att) => {
			if (att.lecture && att.lecture._id) {
				const lectId = att.lecture._id.toString();
				if (!markedLectureIds.has(lectId)) {
					markedLectureIds.add(lectId);
					if (att.status === "Present") presentCount++;
					else if (att.status === "Absent") absentCount++;
				}
			}
		});

		const markedLectures = markedLectureIds.size;
		const unrecordedCount = totalLectures - markedLectures;
		const percentage =
			markedLectures > 0
				? (presentCount / markedLectures) * 100
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
						markedLectures: markedLectures,
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
		const allLectures = await Lecture.find({ subject: { $ne: null } }) // Exclude lectures with null subjects
			.populate("subject")
			.populate("tutor")
			.sort({ date: -1 });

		const lecturesWithoutCompleteAttendance = [];

		for (const lecture of allLectures) {
			// Skip if subject is still null after population (shouldn't happen with the filter above)
			if (!lecture.subject) {
				continue;
			}

			// Get all students enrolled in this lecture's subject
			const enrolledStudents = await User.find({
				subjects: { $in: [lecture.subject._id] },
				role: "Student",
			});

			// Get attendance records for this lecture
			const attendanceRecords = await Attendance.find({
				lecture: lecture._id,
			});

			// If no attendance records exist, or if attendance is not marked for all students
			// then include this lecture in the result
			if (
				attendanceRecords.length === 0 ||
				attendanceRecords.length < enrolledStudents.length
			) {
				lecturesWithoutCompleteAttendance.push(lecture);
			}
		}

		return res.json(
			new ApiResponse(
				200,
				lecturesWithoutCompleteAttendance,
				"Lectures without complete attendance marked fetched successfully"
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
