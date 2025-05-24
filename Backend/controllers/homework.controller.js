const upload = require("../utils/multer.utils");
const {
	uploadToCloudinary,
	cloudinary,
	forceDeleteCloudinaryFile,
} = require("../config/cloudinary");
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
			.populate("subject")
			.populate("tutor")
			.sort({ createdAt: -1 })
			.exec();
		//

		if (!homework || homework.length === 0) {
			return res.json(new ApiResponse(200, [], "No homework found"));
		}
		//

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

		// Check if user is authorized to delete
		if (homework.tutor.toString() !== req.user.id) {
			return res.json(
				new ApiError(403, "Not authorized to delete this homework")
			);
		}

		// Log the homework object to see the exact fileUrl format
		// console.log("Homework to delete:", {
		// 	id: homework._id,
		// 	title: homework.title,
		// 	fileUrl: homework.fileUrl,
		// });

		// Handle file deletion if a file exists
		let fileDeleteStatus = "No file to delete";
		if (homework.fileUrl) {
			// console.log(
			// 	"Attempting to delete homework file:",
			// 	homework.fileUrl
			// );
			try {
				// Use the enhanced force delete method
				const fileDeleted = await forceDeleteCloudinaryFile(
					homework.fileUrl
				);

				if (fileDeleted) {
					// console.log(
					// 	"Successfully deleted homework file from Cloudinary"
					// );
					fileDeleteStatus = "File deleted successfully";
				} else {
					console.log(
						"WARNING: Could not delete homework file from Cloudinary"
					);
					fileDeleteStatus = "File deletion failed";
				}
			} catch (error) {
				console.log(
					"Error during Cloudinary file deletion:",
					error
				);
				fileDeleteStatus = `File deletion error: ${error.message}`;
			}
		}

		// Check if there are any submissions for this homework
		const submissions = await HomeworkSubmission.find({
			homework: homeworkId,
		});

		let submissionResults = [];

		// Delete all submissions associated with this homework
		if (submissions.length > 0) {
			// Delete files from Cloudinary for each submission
			for (const submission of submissions) {
				let submissionStatus = {
					id: submission._id,
					status: "No file",
				};

				if (submission.fileUrl) {
					try {
						// console.log(
						// 	"Attempting to delete submission file:",
						// 	submission.fileUrl
						// );
						// Use the enhanced force delete method for submissions too
						const fileDeleted =
							await forceDeleteCloudinaryFile(
								submission.fileUrl
							);

						if (fileDeleted) {
							submissionStatus.status = "File deleted";
						} else {
							submissionStatus.status =
								"File deletion failed";
							console.log(
								`WARNING: Could not delete submission file: ${submission.fileUrl}`
							);
						}
					} catch (error) {
						submissionStatus.status = `Error: ${error.message}`;
						console.log(
							`Error deleting submission file: ${error.message}`
						);
					}
				}

				submissionResults.push(submissionStatus);
			}

			// Delete all submission records
			await HomeworkSubmission.deleteMany({ homework: homeworkId });
			console.log(
				`Deleted ${submissions.length} submission(s) associated with this homework`
			);
		}

		// Delete homework from database
		await Homework.findByIdAndDelete(homeworkId);

		return res.json(
			new ApiResponse(
				200,
				{
					fileDeleteStatus,
					fileUrl: homework.fileUrl, // Include the URL in the response for debugging
					submissionsDeleted: submissions.length,
					submissionResults,
				},
				"Homework deleted successfully"
			)
		);
	} catch (error) {
		console.log("Error deleting homework:", error);
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
				// Clean up local file if already submitted
				if (req.file && req.file.path)
					await fs.unlink(req.file.path);
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
				fileUrl = await uploadToCloudinary(req.file.path);
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
			.populate("student", "name email")
			.sort({ submittedAt: -1 });

		// Get a list of students who have not submitted
		const submittedStudentIds = submissions.map((sub) =>
			sub.student._id.toString()
		);
		// const subjectDetails = await Subject.findById(homework.subject);
		const allStudents = await User.find({
			subjects: { $in: [homework.subject] },
			role: "Student",
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
