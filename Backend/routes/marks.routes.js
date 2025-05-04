const express = require("express");
const router = express.Router();
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	markStudentMarks,
	editMarks,
	marksAccToSubject,
	trackStudentProgress,
	trackProgressBySubject,
	getMarksDetailsByALec,
} = require("../controllers/marks.controller");

router.post("/markStudentMarks", auth, isAdmin, markStudentMarks);
router.post("/editMarks", auth, isAdmin, editMarks);
router.get(
	"/getMarksDetailsByALec/:lectureId",
	auth,
	isAdmin,
	getMarksDetailsByALec
);

router.get("/marksAccToSubject/:subjectId", auth, isStudent, marksAccToSubject); // Changed from GET to POST
router.get("/trackStudentProgress", auth, isStudent, trackStudentProgress);
router.get("/trackProgressBySubject/:subjectId", auth, isStudent, trackProgressBySubject);

module.exports = router;
