const upload = require("../utils/multer.utils");
const {
	uploadBuffer,
	cloudinary,
	forceDeleteCloudinaryFile,
} = require("../config/cloudinary");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const Homework = require("../models/homework.model");
const HomeworkSubmission = require("../models/homeworkSubmission.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const Standard = require("../models/standard.model");

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
			const { title, subject, description, dueDate, standardId } =
				req.body;
			const tutorId = req.user.id;

			if (!title || !subject || !dueDate) {
				return res.json(
					new ApiError(
						400,
						"Title, subject, and due date are required"
					)
				);
			}

			const standardExists = await Standard.findById(standardId);
			if (!standardExists) {
				return res.json(new ApiError(404, "Standard not found"));
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
				return res.json(new ApiError(404, "Subject not found"));
			}

			let fileUrl = null;
			if (req.file) {
				try {
					fileUrl = await uploadBuffer(
						req.file.buffer,
						process.env.CLOUDINARY_FOLDER || "homework",
						req.file.originalname
					);
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
				standard: standardId,
				description,
				fileUrl,
				dueDate,
			});

			await User.findByIdAndUpdate(tutorId, {
				$push: { homework: newHomework._id },
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
			return res.json(
				new ApiError(
					500,
					"Error in uploading homework: " + error.message
				)
			);
		}
	});
};

module.exports.getStudentsAllHomework = async (req, res) => {
	try {
		const userId = req.user.id;
		const userDetails = await User.findById(userId).populate("profile");
		const standardId = userDetails.profile.standard;

		const homework = await Homework.find({ standard: standardId })
			.populate("subject")
			.populate("tutor")
			.populate("standard")
			.sort({ createdAt: -1 })
			.exec();

		if (!homework || homework.length === 0) {
			return res.json(new ApiResponse(200, [], "No homework found"));
		}

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
			.populate("standard")
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

module.exports.deleteHomework = async (req, res) => {
	try {
		const { homeworkId } = req.params;

		if (!homeworkId) {
			return res.json(new ApiError(400, "Homework ID is required"));
		}

		const homework = await Homework.findById(homeworkId);
		if (!homework) {
			return res.json(new ApiError(404, "Homework not found"));
		}

		// Check authorization
		if (homework.tutor.toString() !== req.user.id) {
			return res.json(
				new ApiError(403, "Not authorized to delete this homework")
			);
		}

		let fileDeleteStatus = "No file to delete";

		// Handle file deletion
		if (homework.fileUrl) {
			console.log("Deleting homework file:", homework.fileUrl);

			try {
				const fileDeleted = await forceDeleteCloudinaryFile(
					homework.fileUrl
				);

				if (fileDeleted) {
					console.log(
						"File deleted successfully from Cloudinary"
					);
					fileDeleteStatus = "File deleted successfully";
				} else {
					console.warn("File deletion failed");
					fileDeleteStatus = "File deletion failed";
				}
			} catch (error) {
				console.error("Error during file deletion:", error);
				fileDeleteStatus = `File deletion error: ${error.message}`;
			}
		}

		// Handle submissions
		const submissions = await HomeworkSubmission.find({
			homework: homeworkId,
		});
		let submissionResults = [];

		if (submissions.length > 0) {
			for (const submission of submissions) {
				if (submission.fileUrl) {
					try {
						const deleted = await forceDeleteCloudinaryFile(
							submission.fileUrl
						);
						submissionResults.push({
							id: submission._id,
							status: deleted
								? "File deleted"
								: "File deletion failed",
						});
					} catch (error) {
						submissionResults.push({
							id: submission._id,
							status: `Error: ${error.message}`,
						});
					}
				}
			}

			await HomeworkSubmission.deleteMany({ homework: homeworkId });
		}

		// Delete homework from database
		await Homework.findByIdAndDelete(homeworkId);

		return res.json(
			new ApiResponse(
				200,
				{
					fileDeleteStatus,
					submissionsDeleted: submissions.length,
					submissionResults,
				},
				"Homework deleted successfully"
			)
		);
	} catch (error) {
		console.error("Error deleting homework:", error);
		return res.json(
			new ApiError(500, "Error deleting homework: " + error.message)
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

			if (!req.file) {
				return res.json(
					new ApiError(400, "A file is required for submission")
				);
			}

			let fileUrl = null;
			try {
				fileUrl = await uploadBuffer(
					req.file.buffer,
					process.env.CLOUDINARY_FOLDER ||
						"homework-submissions",
					req.file.originalname
				);
			} catch (uploadError) {
				throw new ApiError(
					500,
					"Error uploading to Cloudinary: " + uploadError.message
				);
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

			await User.findByIdAndUpdate(studentId, {
				$push: { homework: homeworkId },
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
		const { homeworkId } = req.params;

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
			.populate({
				path: "student",
				select: "name email profile",
				populate: {
					path: "profile",
					populate: {
						path: "standard",
						select: "standardName",
					},
				},
			})
			.sort({ submittedAt: -1 });

		// Get a list of students who have not submitted
		const submittedStudentIds = submissions.map((sub) =>
			sub.student._id.toString()
		);

		const allStudents = await User.find({
			subjects: { $in: [homework.subject] },
			role: "Student",
		})
			.populate({
				path: "profile",
				populate: {
					path: "standard",
					select: "standardName",
				},
			})
			.select("name email profile");

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

module.exports.HWSubmittedByStud = async (req, res) => {
	try {
		const studentId = req.user.id;
		const studentDetails = await User.findById(studentId)
			.populate("homework")
			.exec();
		if (!studentDetails) {
			return res.json(new ApiError(404, "Student not found"));
		}
		return res.json(
			new ApiResponse(
				200,
				studentDetails,
				"Homework submitted by the student fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching homework submitted by student: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching homework submitted by student: " +
					error.message
			)
		);
	}
};
