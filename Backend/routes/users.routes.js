const express = require("express");
const router = express.Router();
const { isTutor, auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	viewStudentProfile,
	getMyStudentsList,
	getAllStudentsList,
	getTutors,
} = require("../controllers/users.controller");

router.get("/viewStudentProfile", auth, isTutor, viewStudentProfile);
router.get("/getMyStudentsList", auth, getMyStudentsList);
router.get("/getAllStudentsList", auth, getAllStudentsList);
router.get("/getTutors", auth, isAdmin, getTutors);

module.exports = router;
