const upload = require("../utils/multer.utils");
const { uploadToCloudinary } = require("../config/cloudinary");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const Homework = require("../models/homework.model");
const HomeworkSubmission = require("../models/homeworkSubmission.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const fs = require("fs").promises;

const uploadMiddleware = upload.single("file");

module.exports.uploadHomework = async (req, res) => {
	uploadMiddleware(req, res, async (err) => {
		if (err) {
			console.log("Error in multer: ", err);
			return res.json(
				new ApiError(400, err.message || "Error uploading file")
			);
		}

		try {
			const { title, subject, description, dueDate } = req.body;
			const tutorId = req.user.id;

			if (!title || !subject || !dueDate) {
				return res.json(
					new ApiError(
						400,
						"Title, subject, and due date are required"
					)
				);
			}

			// Ensure at least one of file or description is provided
			if (!req.file && !description) {
				return res.json(
					new ApiError(
						400,
						"Either a file or a description is required"
					)
				);
			}

			const subjectDetails = await Subject.findById(subject);
			if (!subjectDetails) {
				// Clean up local file if subject not found
				if (req.file && req.file.path)
					await fs.unlink(req.file.path);
				return res.json(new ApiError(404, "Subject not found"));
			}

			let fileUrl = null;
			if (req.file) {
				try {
					fileUrl = await uploadToCloudinary(req.file.path);
				} catch (uploadError) {
					throw new ApiError(
						500,
						"Error uploading to Cloudinary: " +
							uploadError.message
					);
				}
			}

			const newHomework = await Homework.create({
				title,
				subject,
				tutor: tutorId,
				description,
				fileUrl,
				dueDate,
			});

			return res.json(
				new ApiResponse(
					200,
					newHomework,
					"Homework uploaded successfully"
				)
			);
		} catch (error) {
			console.log("Error in uploading homework: ", error);
			// Clean up local file if it still exists
			if (req.file && req.file.path) {
				try {
					await fs.unlink(req.file.path);
				} catch (unlinkError) {
					console.log(
						"Error deleting local file: ",
						unlinkError
					);
				}
			}
			return res.json(
				new ApiError(
					500,
					"Error in uploading homework: " + error.message
				)
			);
		}
	});
};

module.exports.getAllHomework = async (req, res) => {
	try {
		const homework = await Homework.find({})
			.populate("subject", "name code")
			.populate("tutor", "name email")
			.sort({ createdAt: -1 });

		return res.json(
			new ApiResponse(
				200,
				homework,
				"All homework fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching homework: ", error);
		return res.json(
			new ApiError(500, "Error fetching homework: " + error.message)
		);
	}
};

module.exports.getHomeworkBySubject = async (req, res) => {
	try {
		const { subjectId } = req.body;

		if (!subjectId) {
			return res.json(new ApiError(400, "Subject ID is required"));
		}

		const subjectExists = await Subject.findById(subjectId);
		if (!subjectExists) {
			return res.json(new ApiError(404, "Subject not found"));
		}

		const homework = await Homework.find({ subject: subjectId })
			.populate("tutor", "name email")
			.populate("subject", "name code")
			.sort({ createdAt: -1 });

		if (homework.length === 0) {
			return res.json(
				new ApiResponse(
					200,
					[],
					"No homework found for the specified subject"
				)
			);
		}

		return res.json(
			new ApiResponse(
				200,
				homework,
				"All homework by subject fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching homework by subject: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching homework by subject: " + error.message
			)
		);
	}
};

///////////////////// Homework Submission //////////////////////////

module.exports.submitHomework = async (req, res) => {
	uploadMiddleware(req, res, async (err) => {
		if (err) {
			console.log("Error in multer: ", err);
			return res.json(
				new ApiError(400, err.message || "Error uploading file")
			);
		}

		try {
			const { homeworkId } = req.body;
			const studentId = req.user.id;

			if (!homeworkId) {
				return res.json(
					new ApiError(400, "Homework ID is required")
				);
			}

			const homework = await Homework.findById(homeworkId);
			if (!homework) {
				// Clean up local file if homework not found
				if (req.file && req.file.path)
					await fs.unlink(req.file.path);
				return res.json(new ApiError(404, "Homework not found"));
			}

			// Check if the student has already submitted
			const existingSubmission = await HomeworkSubmission.findOne({
				homework: homeworkId,
				student: studentId,
			});
			if (existingSubmission) {
				return res.json(
					new ApiError(
						400,
						"You have already submitted this homework"
					)
				);
			}

			let fileUrl = null;
			if (req.file) {
				try {
					fileUrl = await uploadToCloudinary(req.file.path);
				} catch (uploadError) {
					throw new ApiError(
						500,
						"Error uploading to Cloudinary: " +
							uploadError.message
					);
				}
			}

			// Determine if the submission is late
			const isLate = new Date() > new Date(homework.dueDate);

			const submission = await HomeworkSubmission.create({
				homework: homeworkId,
				student: studentId,
				fileUrl,
				submittedAt: new Date(),
				isLate,
			});

			return res.json(
				new ApiResponse(
					200,
					submission,
					isLate
						? "Homework submitted successfully (Late submission)"
						: "Homework submitted successfully"
				)
			);
		} catch (error) {
			console.log("Error in submitting homework: ", error);
			// Clean up local file if it still exists
			if (req.file && req.file.path) {
				try {
					await fs.unlink(req.file.path);
				} catch (unlinkError) {
					console.log(
						"Error deleting local file: ",
						unlinkError
					);
				}
			}
			return res.json(
				new ApiError(
					500,
					"Error in submitting homework: " + error.message
				)
			);
		}
	});
};

module.exports.getSubmissions = async (req, res) => {
	try {
		const { homeworkId } = req.body;

		if (!homeworkId) {
			return res.json(new ApiError(400, "Homework ID is required"));
		}

		const homework = await Homework.findById(homeworkId).populate(
			"subject"
		);
		if (!homework) {
			return res.json(new ApiError(404, "Homework not found"));
		}

		// Ensure the tutor is authorized to view submissions
		if (homework.tutor.toString() !== req.user.id) {
			return res.json(
				new ApiError(
					403,
					"You are not authorized to view these submissions"
				)
			);
		}

		const submissions = await HomeworkSubmission.find({
			homework: homeworkId,
		})
			.populate("student", "name email")
			.sort({ submittedAt: -1 });

		// Get a list of students who have not submitted
		const submittedStudentIds = submissions.map((sub) =>
			sub.student._id.toString()
		);
		// const subjectDetails = await Subject.findById(homework.subject);
		const allStudents = await User.find({
			subjects: { $in: [homework.subject] },
		});

		const notSubmitted = allStudents.filter(
			(student) =>
				!submittedStudentIds.includes(student._id.toString())
		);

		return res.json(
			new ApiResponse(
				200,
				{ submissions, notSubmitted },
				"Submissions fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching submissions: ", error);
		return res.json(
			new ApiError(500, "Error fetching submissions: " + error.message)
		);
	}
};
