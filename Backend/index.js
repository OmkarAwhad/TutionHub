const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const subjectRoutes = require("./routes/subject.routes");
const lectureRoutes = require("./routes/lecture.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const marksRoutes = require("./routes/marks.routes");

const PORT = process.env.PORT || 5001;

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/mongoose").connect();

app.use("/api/v1/marks", marksRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/lecture", lectureRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
