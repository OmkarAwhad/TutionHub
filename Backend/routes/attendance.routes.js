const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	markAttendance,
	viewAttendanceOfAStud,
	viewStudAttendanceForLec,
	attendAccToSub,
	studsPresentForALec,
	checkLectureAttendance,
	getLecturesWithAttendanceMarked,
	getLecturesWithoutAttendance,
} = require("../controllers/attendance.controller");
const router = express.Router();

router.post("/markAttendance", auth, isAdmin, markAttendance);
router.get("/viewAttendanceOfAStud", auth, isStudent, viewAttendanceOfAStud);
router.get("/attendAccToSub/:subjectId", auth, isStudent, attendAccToSub);
router.get("/viewStudAttendanceForLec", auth, viewStudAttendanceForLec);
router.get("/studsPresentForALec", auth, isAdmin, studsPresentForALec);
router.get("/checkLectureAttendance/:lectureId", auth, checkLectureAttendance);
router.get(
	"/getLecturesWithAttendanceMarked",
	auth,
	isAdmin,
	getLecturesWithAttendanceMarked
);
router.get(
	"/getLecturesWithoutAttendance",
	auth,
	isAdmin,
	getLecturesWithoutAttendance
);

module.exports = router;
