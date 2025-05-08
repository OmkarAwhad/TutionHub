const express = require("express");
const router = express.Router();
const { auth, isTutor, isStudent } = require("../middlewares/auth.middleware");
const {
	uploadHomework,
	getAllHomework,
	getHomeworkBySubject,
	submitHomework,
	getSubmissions,
	deleteHomework,
	HWSubmittedByStud,
} = require("../controllers/homework.controller");

router.post("/submitHomework", auth, isStudent, submitHomework);
router.get("/getSubmissions", auth, isTutor, getSubmissions);
router.get("/HWSubmittedByStud", auth, HWSubmittedByStud);

router.post("/uploadHomework", auth, isTutor, uploadHomework);
router.get("/getAllHomework", auth, getAllHomework);
router.get("/getHomeworkBySubject", auth, getHomeworkBySubject);
router.delete("/deleteHomework/:homeworkId", auth, isTutor, deleteHomework);

module.exports = router;
