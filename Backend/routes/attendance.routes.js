const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	markAttendance,
	viewAttendanceOfAStud,
	viewStudAttendanceForLec,
	attendAccToSub,
} = require("../controllers/attendance.controller");
const router = express.Router();

router.post("/markAttendance", auth, isAdmin, markAttendance);
router.get("/viewAttendanceOfAStud", auth, isStudent, viewAttendanceOfAStud);
router.get("/viewStudAttendanceForLec", auth, viewStudAttendanceForLec);
router.get("/attendAccToSub", auth, isStudent, attendAccToSub);

module.exports = router;
