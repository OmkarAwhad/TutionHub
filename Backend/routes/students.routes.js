const express = require("express");
const router = express.Router();
const { isTutor, auth } = require("../middlewares/auth.middleware");
const {
	viewStudentProfile,
	getMyStudentsList,
	getAllStudentsList,
} = require("../controllers/students.controller");

router.get("/viewStudentProfile", auth, isTutor, viewStudentProfile);
router.get("/getMyStudentsList", auth, getMyStudentsList);
router.get("/getAllStudentsList", auth, getAllStudentsList);

module.exports = router;
