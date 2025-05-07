const upload = require("../utils/multer.utils");
const {
	uploadToCloudinary,
	cloudinary,
	deleteFileFromCloudinary,
} = require("../config/cloudinary"); // Updated import
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const Note = require("../models/notes.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const fs = require("fs").promises;

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
			const { title, subject } = req.body;
			const tutorId = req.user.id;

			if (!req.file) {
				return res.json(new ApiError(400, "File is required"));
			}

			if (!title || !subject) {
				return res.json(
					new ApiError(400, "Title and subject are required")
				);
			}

			const alreadyExists = await Note.findOne({
				subject: subject,
				title: title,
			});
			if (alreadyExists) {
				// Clean up local file if note already exists
				if (req.file && req.file.path) {
					await fs.unlink(req.file.path);
				}
				return res.json(
					new ApiError(
						400,
						"A note with the same title and subject already exists"
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

			let fileUrl;
			try {
				fileUrl = await uploadToCloudinary(req.file.path);
			} catch (uploadError) {
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
			// Clean up local file if it still exists (though uploadToCloudinary should handle this)
			if (req.file && req.file.path && fs.existsSync(req.file.path)) {
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
					"Error in uploading notes: " + error.message
				)
			);
		}
	});
};

module.exports.getAllNotes = async (req, res) => {
	try {
		const notes = await Note.find({})
			.populate("subject", "name code")
			.populate("tutor", "name email")
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
		const { noteId } = req.body;

		if (!noteId) {
			return res.json(new ApiError(400, "Note ID is required"));
		}

		const note = await Note.findById(noteId);
		if (!note) {
			return res.json(new ApiError(404, "Note not found"));
		}

		// Check if user is authorized to delete
		if (note.tutor.toString() !== req.user.id) {
			return res.json(
				new ApiError(403, "Not authorized to delete this note")
			);
		}

		// Handle file deletion if a file exists
		if (note.file) {
			try {
				const fileDeleted = await deleteFileFromCloudinary(
					note.file
				);
				if (fileDeleted) {
					console.log(
						"Successfully deleted note file from Cloudinary"
					);
				} else {
					console.log(
						"Warning: Could not delete note file from Cloudinary"
					);
				}
			} catch (cloudinaryError) {
				console.log(
					"Error during Cloudinary file deletion:",
					cloudinaryError
				);
				// Continue with note deletion despite Cloudinary error
			}
		}

		// Delete note from database regardless of Cloudinary result
		await Note.findByIdAndDelete(noteId);

		return res.json(
			new ApiResponse(200, {}, "Note deleted successfully")
		);
	} catch (error) {
		console.log("Error deleting note:", error);
		return res.json(
			new ApiError(500, "Error deleting note: " + error.message)
		);
	}
};
