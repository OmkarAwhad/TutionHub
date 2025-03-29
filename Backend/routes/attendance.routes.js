const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
  markAttendance,
  viewAttendanceOfAStud,
  viewLectAttendance,
} = require("../controllers/attendance.controller");
const router = express.Router();

router.post("/markAttendance", auth, isAdmin, markAttendance);
router.get("/viewAttendanceOfAStud", auth, isStudent, viewAttendanceOfAStud);
router.get("/viewLectAttendance", auth, viewLectAttendance);

module.exports = router;
