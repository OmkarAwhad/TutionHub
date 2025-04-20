const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	createLecture,
	getLecturesOfWeek,
	getTestDays,
} = require("../controllers/lecture.controller");
const router = express.Router();

router.post("/createLecture", auth, isAdmin, createLecture);
router.get("/getLecturesOfWeek", auth, isStudent, getLecturesOfWeek);
router.get("/getTestDays", auth, isAdmin, getTestDays);

module.exports = router;
