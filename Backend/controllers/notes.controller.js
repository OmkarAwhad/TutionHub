const upload = require("../utils/multer.utils");
const {
	uploadBuffer,
	cloudinary,
	deleteFileFromCloudinary,
	forceDeleteCloudinaryFile,
} = require("../config/cloudinary");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const Note = require("../models/notes.model");
const Subject = require("../models/subject.model");
const Standard = require("../models/standard.model");
const User = require("../models/user.model");

// Multer middleware specific to this controller
const uploadMiddleware = upload.single("file");

module.exports.uploadNotes = async (req, res) => {
	uploadMiddleware(req, res, async (err) => {
		if (err) {
			console.log("Error in multer: ", err);
			return res.json(
				new ApiError(400, err.message || "Error uploading file")
			);
		}

		try {
			const { title, subject, standardId } = req.body;
			const tutorId = req.user.id;

			if (!req.file) {
				return res.json(new ApiError(400, "File is required"));
			}

			if (!title || !subject || !standardId) {
				return res.json(
					new ApiError(
						400,
						"Title, subject, and standard are required"
					)
				);
			}

			const standardExists = await Standard.findById(standardId);
			if (!standardExists) {
				return res.json(new ApiError(404, "Standard not found"));
			}

			const alreadyExists = await Note.findOne({
				subject: subject,
				title: title,
				standard: standardId,
			});
			if (alreadyExists) {
				return res.json(
					new ApiError(
						400,
						"A note with the same title and subject already exists"
					)
				);
			}

			const subjectDetails = await Subject.findById(subject);
			if (!subjectDetails) {
				return res.json(new ApiError(404, "Subject not found"));
			}

			let fileUrl;
			try {
				fileUrl = await uploadBuffer(
					req.file.buffer,
					process.env.CLOUDINARY_FOLDER || "notes",
					req.file.originalname
				);
			} catch (uploadError) {
				console.error("Cloudinary upload error:", uploadError);
				throw new ApiError(
					500,
					"Error uploading to Cloudinary: " + uploadError.message
				);
			}

			const newNote = await Note.create({
				title,
				subject,
				file: fileUrl,
				tutor: tutorId,
				standard: standardId,
				uploadDate: new Date(),
			});

			await User.findByIdAndUpdate(tutorId, {
				$push: { notes: newNote._id },
			});

			return res.json(
				new ApiResponse(200, newNote, "Notes uploaded successfully")
			);
		} catch (error) {
			console.log("Error in uploading notes: ", error);
			return res.json(
				new ApiError(
					500,
					"Error in uploading notes: " + error.message
				)
			);
		}
	});
};

module.exports.getStudentsAllNotes = async (req, res) => {
	try {
		const userId = req.user.id;
		const userDetails = await User.findById(userId).populate("profile");

		if (
			!userDetails ||
			!userDetails.profile ||
			!userDetails.profile.standard
		) {
			return res.json(
				new ApiError(404, "User profile or standard not found")
			);
		}

		const standardId = userDetails.profile.standard;

		const notes = await Note.find({ standard: standardId })
			.populate("subject", "name code")
			.populate("tutor", "name email")
			.populate("standard")
			.sort({ uploadDate: -1 });

		return res.json(
			new ApiResponse(200, notes, "All notes fetched successfully")
		);
	} catch (error) {
		console.log("Error fetching notes: ", error);
		return res.json(
			new ApiError(500, "Error fetching notes: " + error.message)
		);
	}
};

module.exports.getNotesBySubject = async (req, res) => {
	try {
		const { subjectId } = req.body;

		if (!subjectId) {
			return res.json(new ApiError(400, "Subject ID is required"));
		}

		const subjectExists = await Subject.findById(subjectId);
		if (!subjectExists) {
			return res.json(new ApiError(404, "Subject not found"));
		}

		const notes = await Note.find({ subject: subjectId })
			.populate("tutor", "name email")
			.populate("subject", "name code")
			.populate("standard")
			.sort({ uploadDate: -1 });

		if (notes.length === 0) {
			return res.json(
				new ApiResponse(
					200,
					[],
					"No notes found for the specified subject"
				)
			);
		}

		return res.json(
			new ApiResponse(
				200,
				notes,
				"All notes by subject fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error fetching notes by subject: ", error);
		return res.json(
			new ApiError(
				500,
				"Error fetching notes by subject: " + error.message
			)
		);
	}
};

module.exports.deleteNote = async (req, res) => {
	try {
		const { noteId } = req.params;

		if (!noteId) {
			return res.json(new ApiError(400, "Note ID is required"));
		}

		const note = await Note.findById(noteId);
		if (!note) {
			return res.json(new ApiError(404, "Note not found"));
		}

		// Check authorization
		if (note.tutor.toString() !== req.user.id) {
			return res.json(
				new ApiError(403, "Not authorized to delete this note")
			);
		}

		let fileDeleteStatus = "No file to delete";

		// Handle file deletion
		if (note.file) {
			try {
				const fileDeleted = await forceDeleteCloudinaryFile(
					note.file
				);

				if (fileDeleted) {
					fileDeleteStatus = "File deleted successfully";
				} else {
					fileDeleteStatus = "File deletion failed";
				}
			} catch (error) {
				fileDeleteStatus = `File deletion error: ${error.message}`;
			}
		}

		// Delete note from database
		await Note.findByIdAndDelete(noteId);

		return res.json(
			new ApiResponse(
				200,
				{
					fileDeleteStatus,
					fileUrl: note.file,
					noteId: note._id,
					title: note.title,
				},
				"Note deleted successfully"
			)
		);
	} catch (error) {
		console.error("Error deleting note:", error);
		return res.json(
			new ApiError(500, "Error deleting note: " + error.message)
		);
	}
};
