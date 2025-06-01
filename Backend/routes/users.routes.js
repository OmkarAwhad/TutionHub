const express = require("express");
const router = express.Router();
const { isTutor, auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	viewStudentProfile,
	getMyStudentsList,
	getAllStudentsList,
	getTutors,
	getMyStudentsListByLec,
	getMyDetails,
} = require("../controllers/users.controller");

router.get("/viewStudentProfile/:studentId", auth, isTutor, viewStudentProfile);
router.get("/getMyStudentsList", auth, isTutor, getMyStudentsList);
router.get("/getAllStudentsList", auth, getAllStudentsList);
router.get("/getTutors", auth, isAdmin, getTutors);
router.get("/getMyDetails", auth, getMyDetails);
router.get("/getMyStudentsListByLec/:lectureId", auth, getMyStudentsListByLec);

module.exports = router;
