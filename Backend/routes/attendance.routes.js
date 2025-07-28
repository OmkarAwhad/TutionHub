const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	markAttendance,
	viewMyAttendance,
	viewStudAttendanceForLec,
	attendAccToSub,
	StudAttendAccToSubForTutor,
	studsPresentForALec,
	checkLectureAttendance,
	getLecturesWithAttendanceMarked,
	getLecturesWithoutAttendance,
	getAttendanceForEdit,
	updateAttendance,
	deleteAttendanceForLecture,
} = require("../controllers/attendance.controller");
const router = express.Router();

router.post("/markAttendance", auth, isAdmin, markAttendance);
router.get("/viewMyAttendance", auth, viewMyAttendance); // for students
router.get("/viewMyAttendance/:userId", auth, viewMyAttendance); // for admin
// Routes - Change to POST to accommodate request body
router.post("/attendAccToSub/:userId", auth, attendAccToSub); // for admin - userId in params
router.post("/attendAccToSub", auth, attendAccToSub); // for students - no userId

router.post("/StudAttendAccToSubForTutor", auth, StudAttendAccToSubForTutor);
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
router.get(
	"/getAttendanceForEdit/:lectureId",
	auth,
	isAdmin,
	getAttendanceForEdit
);
router.put("/updateAttendance/:lectureId", auth, isAdmin, updateAttendance);
router.delete(
	"/deleteAttendance/:lectureId",
	auth,
	isAdmin,
	deleteAttendanceForLecture
);

module.exports = router;
