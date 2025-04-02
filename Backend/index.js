const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { cloudinaryConnect } = require("./config/cloudinary");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const subjectRoutes = require("./routes/subject.routes");
const lectureRoutes = require("./routes/lecture.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const marksRoutes = require("./routes/marks.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const notesRoutes = require("./routes/notes.routes");

const PORT = process.env.PORT || 5001;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads/notes");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("./config/mongoose").connect();

app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/marks", marksRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/lecture", lectureRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: "Internal Server Error",
		error:
			process.env.NODE_ENV === "development" ? err.message : undefined,
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
