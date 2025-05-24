const express = require("express");
const {
	createSubject,
	updateSubject,
	deleteSubject,
	getAllSubjects,
	assignSubject,
	subsOfThatUser,
} = require("../controllers/subject.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/createSubject", auth, isAdmin, createSubject);
router.post("/updateSubject", auth, isAdmin, updateSubject);
router.delete("/deleteSubject", auth, isAdmin, deleteSubject);
router.get("/getAllSubjects", auth, getAllSubjects);
router.post("/assignSubject", auth, isAdmin, assignSubject);
router.get("/subsOfThatUser", auth, subsOfThatUser);

module.exports = router;
