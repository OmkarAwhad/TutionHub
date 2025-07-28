const express = require("express");
const router = express.Router();
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	markStudentMarks,
	getMarksDetailsByALec,
	getMarksForEdit,
	updateMarksInBulk,
	deleteMarksForLecture,
	getStudentAnalytics,
	getPerformanceComparison,
} = require("../controllers/marks.controller");

router.post("/markStudentMarks", auth, isAdmin, markStudentMarks);
router.get(
	"/getMarksDetailsByALec/:lectureId",
	auth,
	isAdmin,
	getMarksDetailsByALec
);
router.get("/getMarksForEdit/:lectureId", auth, isAdmin, getMarksForEdit);
router.put("/updateMarksInBulk/:lectureId", auth, isAdmin, updateMarksInBulk);
router.delete("/deleteMarks/:lectureId", auth, isAdmin, deleteMarksForLecture);
router.get("/getStudentAnalytics", auth, getStudentAnalytics); // for students
router.get("/getStudentAnalytics/:userId", auth, getStudentAnalytics); // for admin
router.get(
	"/getPerformanceComparison/:subjectId",
	auth,
	isStudent,
	getPerformanceComparison
);


module.exports = router;
