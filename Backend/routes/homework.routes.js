const express = require("express");
const router = express.Router();
const { auth, isTutor, isStudent } = require("../middlewares/auth.middleware");
const {
	uploadHomework,
	getAllHomework,
	getHomeworkBySubject,
	submitHomework,
	getSubmissions,
} = require("../controllers/homework.controller");

router.post("/submitHomework", auth, isStudent, submitHomework);
router.get("/getSubmissions", auth, isTutor, getSubmissions);

router.post("/uploadHomework", auth, isTutor, uploadHomework);
router.get("/getAllHomework", auth, getAllHomework);
router.get("/getHomeworkBySubject", auth, getHomeworkBySubject);

module.exports = router;
