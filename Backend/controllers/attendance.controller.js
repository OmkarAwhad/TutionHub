const Attendance = require("../models/attendance.model");
const Lecture = require("../models/lecture.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

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
		// .populate("student")
		// .populate("lecture")
		// .exec();

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

		// console.log("Subject IDs : ",subjectIds)

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

		// console.log("lectureDetails : ",lectureDetails)

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
			totalLectures > 0 ? (presentCount / totalLectures) * 100 : 0;

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
		const { lectureId } = req.body;
		const attendanceDetails = await Attendance.find({
			lecture: lectureId,
		})
			.populate("student")
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

module.exports.attendAccToSub = async (req, res) => {
	try {
		const userId = req.user.id;
		const { subject } = req.body;

		const isSubjectTakenByStud = await User.findOne({
			subjects: { $in: [subject] },
		});
		if (!isSubjectTakenByStud) {
			return res.json(
				new ApiError(
					400,
					"Student is not enrolled in the specified subject"
				)
			);
		}

		const lectureDetails = await Lecture.find({ subject: subject });
		if (!lectureDetails || lectureDetails.length === 0) {
			return res.json(
				new ApiError(400, "No lectures found for this subject")
			);
		}

		const lectureIds = lectureDetails
			.filter((lect) => lect.date < Date.now())
			.map((lect) => lect._id);

		const attendanceDetails = await Attendance.find({
			student: userId,
			lecture: { $in: lectureIds },
		}).populate({ path: "lecture", populate: "subject" });

		const totalLectures = lectureIds.length;
		const presentCount = attendanceDetails.filter(
			(att) => att.status === "Present"
		).length;
		const absentCount = attendanceDetails.filter(
			(att) => att.status === "Absent"
		).length;
		const percentage =
			totalLectures > 0 ? (presentCount / totalLectures) * 100 : 0;

		return res.json(
			new ApiResponse(
				200,
				{
					attendanceDetails,
					statistics: {
						totalLectures,
						present: presentCount,
						absent: absentCount,
						unrecorded:
							totalLectures - (presentCount + absentCount),
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
