// utils/multer.utils.js
const multer = require("multer");

// ------- MEMORY STORAGE (no folders on disk) -------
const storage = multer.memoryStorage();

const allowed = [
	"image/jpeg",
	"image/png",
	"application/pdf",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
	if (allowed.includes(file.mimetype)) return cb(null, true);
	cb(new Error("Invalid file type"), false);
};

module.exports = multer({
	storage,
	fileFilter,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
