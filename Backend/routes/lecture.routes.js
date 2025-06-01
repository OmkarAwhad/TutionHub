const express = require("express");
const {
	auth,
	isAdmin,
	isStudent,
	isTutor,
} = require("../middlewares/auth.middleware");
const {
	createLecture,
	getLecturesOfWeek,
	getLectByDesc,
	updateLecture,
	deleteLecture,
	getAllLectures,
	getLectureBySub,
	getLecturesByDate,
	getTutorLecturesByDate,
} = require("../controllers/lecture.controller");
const router = express.Router();

router.post("/createLecture", auth, isAdmin, createLecture);
router.get("/getLecturesOfWeek", auth, isStudent, getLecturesOfWeek);
router.get("/getLectByDesc", auth, isAdmin, getLectByDesc);
router.put("/updateLecture/:lectureId", auth, isAdmin, updateLecture);
router.delete("/deleteLecture", auth, isAdmin, deleteLecture);
router.get("/getAllLectures", auth, isAdmin, getAllLectures);
router.get("/getLectureBySub", auth, isAdmin, getLectureBySub);
router.post("/getLecturesByDate", auth, isStudent, getLecturesByDate);
router.post("/getTutorLecturesByDate", auth, isTutor, getTutorLecturesByDate);

module.exports = router;
