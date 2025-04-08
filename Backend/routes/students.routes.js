const express = require("express");
const router = express.Router();
const { isTutor } = require("../middlewares/auth.middleware");
const { viewStudentProfile } = require("../controllers/students.controller");

router.get("/viewStudentProfile", isTutor, viewStudentProfile);

module.exports = router;
