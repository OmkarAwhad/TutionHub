const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	createLecture,
	getLecturesByDay,
	getTestDays,
} = require("../controllers/lecture.controller");
const router = express.Router();

router.post("/createLecture", auth, isAdmin, createLecture);
router.get("/getLecturesByDay", auth, isAdmin, getLecturesByDay);
router.get("/getTestDays", auth, isAdmin, getTestDays);

module.exports = router;
