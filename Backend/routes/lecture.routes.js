const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	createLecture,
	getLecturesOfWeek,
	getLectByDesc,
	updateLecture,
	deleteLecture,
	getAllLectures,
	getLectureBySub,
} = require("../controllers/lecture.controller");
const router = express.Router();

router.post("/createLecture", auth, isAdmin, createLecture);
router.get("/getLecturesOfWeek", auth, isStudent, getLecturesOfWeek);
router.get("/getLectByDesc", auth, isAdmin, getLectByDesc);
router.put("/updateLecture/:lectureId", auth, isAdmin, updateLecture);
router.delete("/deleteLecture", auth, isAdmin, deleteLecture);
router.get("/getAllLectures", auth, isAdmin, getAllLectures);
router.get("/getLectureBySub", auth, isAdmin, getLectureBySub);

module.exports = router;
