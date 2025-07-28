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
		return res.json(new ApiError(500, "Error in marking attendance "));
	}
};

module.exports.viewMyAttendance = async (req, res) => {
	try {
		let userId = req.user.id;

		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.json(new ApiError(404, "User not found"));
		}

		if (userDetails.role === "Tutor") {
			return res.json(
				new ApiError(
					403,
					"Tutors are not allowed to view this attendance"
				)
			);
		}

		// If admin and userId param is present, use that
		if (userDetails.role === "Admin" && req.params.userId) {
			userId = req.params.userId;

			// Verify the target student exists
			const targetStudent = await User.findById(userId);
			if (!targetStudent || targetStudent.role !== "Student") {
				return res.json(new ApiError(404, "Student not found"));
			}
		}

		// If admin but no userId param, return error
		if (userDetails.role === "Admin" && !req.params.userId) {
			return res.json(
				new ApiError(400, "Student userId is required for admin")
			);
		}

		// Get the student's details (either current user or target student)
		const studentDetails = await User.findById(userId);
		const subjectIds = studentDetails.subjects.map((elm) => elm._id);

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
			markedLectures > 0 ? (presentCount / markedLectures) * 100 : 0;

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
		return res.json(
			new ApiError(500, "Error in fetching student attendance ")
		);
	}
};

module.exports.attendAccToSub = async (req, res) => {
	try {
		let userId = req.user.id;
		const { subjectId } = req.body; // Get subjectId from request body
		const { userId: targetUserId } = req.params; // Get userId from route params

		if (!subjectId) {
			return res.json(
				new ApiError(400, "Subject ID is required in request body")
			);
		}

		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.json(new ApiError(404, "User not found"));
		}

		if (userDetails.role === "Tutor") {
			return res.json(
				new ApiError(
					403,
					"Tutors are not allowed to view this attendance"
				)
			);
		}

		// If admin and targetUserId is present, use that
		if (userDetails.role === "Admin" && targetUserId) {
			userId = targetUserId;
			// console.log("Admin viewing user id:", userId);

			// Verify the target student exists
			const targetStudent = await User.findById(userId);
			if (!targetStudent || targetStudent.role !== "Student") {
				return res.json(new ApiError(404, "Student not found"));
			}
		}

		// If admin but no targetUserId, return error
		if (userDetails.role === "Admin" && !targetUserId) {
			return res.json(
				new ApiError(400, "Student userId is required for admin")
			);
		}

		// Check if student is enrolled in the subject
		const studentDetails = await User.findOne({
			_id: userId,
			subjects: { $in: [subjectId] },
		});

		if (!studentDetails) {
			return res.json(
				new ApiError(
					400,
					"Student is not enrolled in the specified subject"
				)
			);
		}

		const lectureDetails = await Lecture.find({ subject: subjectId });
		if (!lectureDetails || lectureDetails.length === 0) {
			// Fetch subject name for better error message
			let subjectName = "";
			try {
				const subjectDoc = await mongoose
					.model("Subject")
					.findById(subjectId);
				subjectName =
					subjectDoc && subjectDoc.name
						? ` ${subjectDoc.name}`
						: "";
			} catch {}
			return res.json(
				new ApiError(
					400,
					`No lectures found for this subject ${subjectName}`
				)
			);
		}

		const lectureIds = lectureDetails.map((lect) => lect._id);

		const attendanceDetails = await Attendance.find({
			student: userId,
			lecture: { $in: lectureIds },
		}).populate({ path: "lecture", populate: { path: "subject" } });

		const totalLectures = lectureDetails.length;

		// Use Set to track unique lecture IDs
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
			markedLectures > 0 ? (presentCount / markedLectures) * 100 : 0;

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
		console.error("Error in attendAccToSub:", error);
		return res.json(
			new ApiError(
				500,
				"Error in fetching attendance acc to a subject"
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
			// Fetch subject name for better error message
			let subjectName = "";
			try {
				const subjectDoc = await mongoose
					.model("Subject")
					.findById(subjectId);
				subjectName =
					subjectDoc && subjectDoc.name
						? ` (${subjectDoc.name})`
						: "";
			} catch {}
			return res.json(
				new ApiError(
					400,
					`No lectures found for this subject${subjectName}`
				)
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
			markedLectures > 0 ? (presentCount / markedLectures) * 100 : 0;

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

		const attendanceExists = await Attendance.find({ lecture: lectureId })
			.populate("student")
			.populate("lecture")
			.exec();

		return res.json(
			new ApiResponse(
				200,
				{
					attendanceMarked: attendanceExists.length > 0,
					attendanceRecords: attendanceExists,
				},
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
			.sort({ date: 1 });

		const lecturesWithoutCompleteAttendance = [];

		for (const lecture of allLectures) {
			// Skip if subject is still null after population
			if (!lecture.subject) {
				continue;
			}

			// Check if lecture time has passed
			const lectureDate = new Date(lecture.date);
			const currentDate = new Date();

			// If lecture is on a future date, skip it
			const lectureDateOnly = new Date(
				lectureDate.getFullYear(),
				lectureDate.getMonth(),
				lectureDate.getDate()
			);
			const currentDateOnly = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				currentDate.getDate()
			);

			if (lectureDateOnly > currentDateOnly) {
				continue;
			}

			// If lecture is today, check if the time has passed
			if (lectureDateOnly.getTime() === currentDateOnly.getTime()) {
				const timeRange = lecture.time;
				const endTime = extractEndTime(timeRange);

				if (endTime) {
					const hasPassedTime = hasTimePassed(endTime);

					if (!hasPassedTime) {
						continue;
					}
				}
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
			} else {
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
		return res.json(
			new ApiError(
				500,
				"Error in fetching lectures without attendance: " +
					error.message
			)
		);
	}
};

// Helper function to extract end time from time range
function extractEndTime(timeRange) {
	try {
		// Extract end time from format like "11:00 AM to 12:00 PM"
		const parts = timeRange.split(" to ");
		if (parts.length === 2) {
			return parts[1].trim();
		}
		return null;
	} catch (error) {
		return null;
	}
}

// Helper function to check if current time has passed the given time
function hasTimePassed(timeString) {
	try {
		const currentTime = new Date();
		const [time, meridiem] = timeString.split(" ");
		const [hours, minutes] = time.split(":");

		let hour24 = parseInt(hours);
		if (meridiem.toUpperCase() === "PM" && hour24 !== 12) {
			hour24 += 12;
		} else if (meridiem.toUpperCase() === "AM" && hour24 === 12) {
			hour24 = 0;
		}

		const lectureEndTime = new Date();
		lectureEndTime.setHours(hour24, parseInt(minutes), 0, 0);

		return currentTime > lectureEndTime;
	} catch (error) {
		return false; // If we can't parse, assume time hasn't passed
	}
}

module.exports.getAttendanceForEdit = async (req, res) => {
	try {
		const { lectureId } = req.params;

		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		// Get lecture details
		const lecture = await Lecture.findById(lectureId)
			.populate("subject")
			.populate("tutor");

		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		// Get all students enrolled in this subject
		const enrolledStudents = await User.find({
			subjects: { $in: [lecture.subject._id] },
			role: "Student",
		}).sort({ name: 1 });

		// Get existing attendance records
		const attendanceRecords = await Attendance.find({
			lecture: lectureId,
		}).populate("student", "name");

		// Create attendance map for quick lookup
		const attendanceMap = {};
		attendanceRecords.forEach((record) => {
			attendanceMap[record.student._id.toString()] = record.status;
		});

		// Prepare student list with attendance status
		const studentsWithAttendance = enrolledStudents.map((student) => ({
			_id: student._id,
			name: student.name,
			status: attendanceMap[student._id.toString()] || null,
		}));

		return res.json(
			new ApiResponse(
				200,
				{
					lecture,
					studentsWithAttendance,
					totalStudents: enrolledStudents.length,
					markedStudents: attendanceRecords.length,
				},
				"Attendance data for editing fetched successfully"
			)
		);
	} catch (error) {
		return res.json(
			new ApiError(
				500,
				"Error fetching attendance for edit: " + error.message
			)
		);
	}
};

module.exports.updateAttendance = async (req, res) => {
	try {
		const { lectureId } = req.params;
		const { attendanceData } = req.body; // Array of {studentId, status}

		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		if (!attendanceData || !Array.isArray(attendanceData)) {
			return res.json(
				new ApiError(400, "Valid attendance data is required")
			);
		}

		// Check if lecture exists
		const lecture = await Lecture.findById(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		// Delete existing attendance records for this lecture
		await Attendance.deleteMany({ lecture: lectureId });

		// Create new attendance records
		const attendancePromises = attendanceData
			.filter((data) => data.status && data.status !== null) // Only create records for marked attendance
			.map(async (data) => {
				return await Attendance.create({
					student: data.studentId,
					lecture: lectureId,
					status: data.status,
				});
			});

		const updatedRecords = await Promise.all(attendancePromises);

		// Update lecture's isMarked field if any attendance is recorded
		await Lecture.findByIdAndUpdate(lectureId, {
			isMarked: updatedRecords.length > 0,
		});

		return res.json(
			new ApiResponse(
				200,
				{
					updatedRecords: updatedRecords.length,
					lectureId: lectureId,
				},
				"Attendance updated successfully"
			)
		);
	} catch (error) {
		return res.json(
			new ApiError(500, "Error updating attendance: " + error.message)
		);
	}
};

module.exports.deleteAttendanceForLecture = async (req, res) => {
	try {
		const { lectureId } = req.params;

		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		// Check if lecture exists
		const lecture = await Lecture.findById(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		// Delete all attendance records for this lecture
		const deleteResult = await Attendance.deleteMany({
			lecture: lectureId,
		});

		// Update lecture's isMarked field to false
		await Lecture.findByIdAndUpdate(lectureId, { isMarked: false });

		return res.json(
			new ApiResponse(
				200,
				{
					deletedCount: deleteResult.deletedCount,
					lectureId: lectureId,
				},
				"Attendance deleted successfully"
			)
		);
	} catch (error) {
		return res.json(
			new ApiError(500, "Error deleting attendance: " + error.message)
		);
	}
};
