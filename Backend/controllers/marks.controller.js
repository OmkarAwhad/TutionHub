const Marks = require("../models/marks.model");
const Lecture = require("../models/lecture.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.markStudentMarks = async (req, res) => {
	try {
		const { studentId, lectureId, marks, totalMarks, description } =
			req.body;
		const userId = req.user.id;

		if (!studentId || !lectureId || marks == null || !totalMarks) {
			return res.json(
				new ApiError(
					400,
					"All fields (studentId, lectureId, marks, totalMarks) are required."
				)
			);
		}

		if (
			isNaN(marks) ||
			isNaN(totalMarks) ||
			marks < 0 ||
			totalMarks <= 0 ||
			marks > totalMarks
		) {
			return res.json(
				new ApiError(
					400,
					"Invalid marks or totalMarks. Ensure marks are non-negative, totalMarks is positive, and marks do not exceed totalMarks."
				)
			);
		}

		const studentDetails = await User.findById(studentId);
		if (!studentDetails) {
			return res.json(new ApiError(404, "Student not found."));
		}

		const lectureDetails = await Lecture.findById(lectureId);
		if (!lectureDetails) {
			return res.json(new ApiError(404, "Lecture not found."));
		}
		if (lectureDetails.description !== "Test") {
			return res.json(
				new ApiError(
					400,
					"Marks can only be marked for lectures with the description 'Test'."
				)
			);
		}

		const marksDetails = await Marks.create({
			student: studentId,
			lecture: lectureId,
			subject: lectureDetails.subject._id,
			marks: marks,
			totalMarks: totalMarks,
			updatedBy: userId,
			description: description ? description : "",
		});

		// Update the lecture to set marksMarked to true
		await Lecture.findByIdAndUpdate(lectureId, { marksMarked: true });

		return res.json(
			new ApiResponse(200, marksDetails, "Marks marked successfully")
		);
	} catch (error) {
		console.log("Error in marking the marks for that student ", error);
		return res.json(
			new ApiError(500, "Error in marking the marks for that student ")
		);
	}
};

module.exports.getMarksDetailsByALec = async (req, res) => {
	try {
		const { lectureId } = req.params;
		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture Id not found"));
		}
		const lectureDetails = await Lecture.findById(lectureId);
		if (!lectureDetails) {
			return res.json(new ApiError(404, "Lecture not found."));
		}

		const marksDetails = await Marks.find({ lecture: lectureId })
			.populate("student")
			.populate("subject")
			.exec();
		if (!marksDetails) {
			return res.json(
				new ApiError(404, "No marks data found for the lecture.")
			);
		}

		return res.json(
			new ApiResponse(
				200,
				marksDetails,
				"Marks details fetched successfully for the lecture"
			)
		);
	} catch (error) {
		console.log("Error in fetching marks details by lecture ", error);
		return res.json(
			new ApiError(500, "Error in fetching marks details by lecture")
		);
	}
};

module.exports.getMarksForEdit = async (req, res) => {
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

		if (lecture.description !== "Test") {
			return res.json(
				new ApiError(
					400,
					"Marks can only be edited for Test lectures"
				)
			);
		}

		// Get all students who were present for this lecture
		const attendanceRecords = await require("../models/attendance.model")
			.find({
				lecture: lectureId,
				status: "Present",
			})
			.populate("student", "name");

		// Get existing marks records
		const marksRecords = await Marks.find({
			lecture: lectureId,
		}).populate("student", "name");

		// Create marks map for quick lookup
		const marksMap = {};
		marksRecords.forEach((record) => {
			marksMap[record.student._id.toString()] = {
				marks: record.marks,
				totalMarks: record.totalMarks,
				description: record.description || "",
			};
		});

		// Prepare student list with marks data
		const studentsWithMarks = attendanceRecords.map((attendance) => ({
			_id: attendance.student._id,
			name: attendance.student.name,
			marks: marksMap[attendance.student._id.toString()]?.marks || 0,
			totalMarks:
				marksMap[attendance.student._id.toString()]?.totalMarks ||
				0,
			description:
				marksMap[attendance.student._id.toString()]?.description ||
				"",
		}));

		// Get total marks from first record or default
		const defaultTotalMarks =
			marksRecords.length > 0 ? marksRecords[0].totalMarks : 0;

		return res.json(
			new ApiResponse(
				200,
				{
					lecture,
					studentsWithMarks,
					defaultTotalMarks,
					totalStudents: attendanceRecords.length,
					markedStudents: marksRecords.length,
				},
				"Marks data for editing fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching marks for edit:", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching marks for edit: " + error.message
			)
		);
	}
};

module.exports.updateMarksInBulk = async (req, res) => {
	try {
		const { lectureId } = req.params;
		const { marksData, totalMarks } = req.body; // Array of {studentId, marks, description}

		if (!lectureId) {
			return res.json(new ApiError(400, "Lecture ID is required"));
		}

		if (!marksData || !Array.isArray(marksData)) {
			return res.json(
				new ApiError(400, "Valid marks data is required")
			);
		}

		if (!totalMarks || totalMarks <= 0) {
			return res.json(
				new ApiError(400, "Valid total marks is required")
			);
		}

		// Check if lecture exists and is a test
		const lecture = await Lecture.findById(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		if (lecture.description !== "Test") {
			return res.json(
				new ApiError(
					400,
					"Marks can only be updated for Test lectures"
				)
			);
		}

		// Delete existing marks records for this lecture
		await Marks.deleteMany({ lecture: lectureId });

		// Create new marks records
		const marksPromises = marksData
			.filter(
				(data) => data.marks !== null && data.marks !== undefined
			) // Only create records for marked students
			.map(async (data) => {
				if (data.marks > totalMarks) {
					throw new Error(
						`Marks ${data.marks} cannot be greater than total marks ${totalMarks}`
					);
				}

				return await Marks.create({
					student: data.studentId,
					lecture: lectureId,
					subject: lecture.subject,
					marks: data.marks,
					totalMarks: totalMarks,
					description: data.description || "",
					updatedBy: req.user.id,
				});
			});

		const updatedRecords = await Promise.all(marksPromises);

		// Update lecture's marksMarked field
		await Lecture.findByIdAndUpdate(lectureId, {
			marksMarked: updatedRecords.length > 0,
		});

		return res.json(
			new ApiResponse(
				200,
				{
					updatedRecords: updatedRecords.length,
					lectureId: lectureId,
				},
				"Marks updated successfully"
			)
		);
	} catch (error) {
		console.log("Error updating marks:", error);
		return res.json(
			new ApiError(500, "Error updating marks: " + error.message)
		);
	}
};

module.exports.deleteMarksForLecture = async (req, res) => {
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

		// Delete all marks records for this lecture
		const deleteResult = await Marks.deleteMany({ lecture: lectureId });

		// Update lecture's marksMarked field to false
		await Lecture.findByIdAndUpdate(lectureId, { marksMarked: false });

		return res.json(
			new ApiResponse(
				200,
				{
					deletedCount: deleteResult.deletedCount,
					lectureId: lectureId,
				},
				"Marks deleted successfully"
			)
		);
	} catch (error) {
		console.log("Error deleting marks:", error);
		return res.json(
			new ApiError(500, "Error deleting marks: " + error.message)
		);
	}
};

module.exports.getStudentAnalytics = async (req, res) => {
	try {
		let userId = req.user.id;

		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.json(new ApiError(404, "User not found."));
		}

		if (userDetails.role === "Tutor") {
			return res.json(
				new ApiError(
					403,
					"Tutors are not allowed to access this route."
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

		const marksDetails = await Marks.find({ student: userId })
			.populate({ path: "lecture", populate: { path: "subject" } })
			.sort({ createdAt: -1 })
			.exec();

		if (!marksDetails || marksDetails.length === 0) {
			return res.json(
				new ApiError(404, "No marks data found for the student.")
			);
		}

		// Group by subject for detailed analytics
		const subjectWiseData = {};
		let totalMarksObtained = 0;
		let totalMarksPossible = 0;

		marksDetails.forEach((mark) => {
			const subjectId = mark.lecture.subject._id.toString();
			const subjectName = mark.lecture.subject.name;

			if (!subjectWiseData[subjectId]) {
				subjectWiseData[subjectId] = {
					subjectName,
					subjectCode: mark.lecture.subject.code,
					tests: [],
					totalObtained: 0,
					totalPossible: 0,
					average: 0,
					grade: "",
					improvement: 0,
				};
			}

			subjectWiseData[subjectId].tests.push({
				testId: mark._id,
				description: mark.description,
				marks: mark.marks,
				totalMarks: mark.totalMarks,
				percentage: ((mark.marks / mark.totalMarks) * 100).toFixed(
					1
				),
				date: mark.createdAt,
				lectureDate: mark.lecture.date,
			});

			subjectWiseData[subjectId].totalObtained += mark.marks;
			subjectWiseData[subjectId].totalPossible += mark.totalMarks;
			totalMarksObtained += mark.marks;
			totalMarksPossible += mark.totalMarks;
		});

		// Calculate additional analytics
		Object.keys(subjectWiseData).forEach((subjectId) => {
			const subject = subjectWiseData[subjectId];
			subject.average = (
				(subject.totalObtained / subject.totalPossible) *
				100
			).toFixed(1);

			// Assign grade based on percentage
			const percentage = parseFloat(subject.average);
			if (percentage >= 90) subject.grade = "A+";
			else if (percentage >= 80) subject.grade = "A";
			else if (percentage >= 70) subject.grade = "B+";
			else if (percentage >= 60) subject.grade = "B";
			else if (percentage >= 50) subject.grade = "C";
			else subject.grade = "D";

			// Calculate improvement trend (last test vs first test)
			if (subject.tests.length >= 2) {
				const firstTest = subject.tests[subject.tests.length - 1];
				const lastTest = subject.tests[0];
				const firstPercentage =
					(firstTest.marks / firstTest.totalMarks) * 100;
				const lastPercentage =
					(lastTest.marks / lastTest.totalMarks) * 100;
				subject.improvement = (
					lastPercentage - firstPercentage
				).toFixed(1);
			}
		});

		const overallPercentage = (
			(totalMarksObtained / totalMarksPossible) *
			100
		).toFixed(1);

		// Overall grade calculation
		let overallGrade = "";
		if (overallPercentage >= 90) overallGrade = "A+";
		else if (overallPercentage >= 80) overallGrade = "A";
		else if (overallPercentage >= 70) overallGrade = "B+";
		else if (overallPercentage >= 60) overallGrade = "B";
		else if (overallPercentage >= 50) overallGrade = "C";
		else overallGrade = "D";

		return res.json(
			new ApiResponse(
				200,
				{
					subjectWiseData,
					overallStats: {
						totalMarksObtained,
						totalMarksPossible,
						overallPercentage,
						overallGrade,
						totalTests: marksDetails.length,
						totalSubjects:
							Object.keys(subjectWiseData).length,
					},
					recentTests: marksDetails.slice(0, 5), // Last 5 tests
				},
				"Student analytics fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching student analytics ", error);
		return res.json(
			new ApiError(500, "Error in fetching student analytics")
		);
	}
};

module.exports.getPerformanceComparison = async (req, res) => {
	try {
		const userId = req.user.id;
		const { subjectId } = req.params;

		// Get student's marks for the subject
		const studentMarks = await Marks.find({
			student: userId,
			subject: subjectId,
		}).populate("lecture");

		// Get all students' marks for comparison (class average)
		const allMarks = await Marks.find({ subject: subjectId })
			.populate("lecture")
			.populate("student", "name");

		// Calculate class averages for each test
		const testAverages = {};
		allMarks.forEach((mark) => {
			const lectureId = mark.lecture._id.toString();
			if (!testAverages[lectureId]) {
				testAverages[lectureId] = {
					lectureInfo: mark.lecture,
					totalMarks: 0,
					totalStudents: 0,
					marks: [],
				};
			}
			testAverages[lectureId].totalMarks += mark.marks;
			testAverages[lectureId].totalStudents += 1;
			testAverages[lectureId].marks.push(mark.marks);
		});

		// Calculate averages and prepare comparison data
		const comparisonData = studentMarks.map((studentMark) => {
			const lectureId = studentMark.lecture._id.toString();
			const classData = testAverages[lectureId];
			const classAverage = classData
				? (classData.totalMarks / classData.totalStudents).toFixed(
						1
				  )
				: 0;
			const studentPercentage = (
				(studentMark.marks / studentMark.totalMarks) *
				100
			).toFixed(1);
			const classPercentage = classData
				? ((classAverage / studentMark.totalMarks) * 100).toFixed(1)
				: 0;

			return {
				testInfo: studentMark.lecture,
				studentMarks: studentMark.marks,
				totalMarks: studentMark.totalMarks,
				studentPercentage,
				classAverage: parseFloat(classAverage),
				classPercentage: parseFloat(classPercentage),
				performanceDiff: (
					studentPercentage - classPercentage
				).toFixed(1),
			};
		});

		return res.json(
			new ApiResponse(
				200,
				comparisonData,
				"Performance comparison fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching performance comparison ", error);
		return res.json(
			new ApiError(500, "Error in fetching performance comparison")
		);
	}
};
