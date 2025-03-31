const express = require("express");
const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
<<<<<<< HEAD
	markAttendance,
	viewAttendanceOfAStud,
	viewStudAttendanceForLec,
	attendAccToSub,
=======
  markAttendance,
  viewAttendanceOfAStud,
  viewLectAttendance,
>>>>>>> c81fda7fc2400d50be15b80f79e019ce0f2b3fe5
} = require("../controllers/attendance.controller");
const router = express.Router();

router.post("/markAttendance", auth, isAdmin, markAttendance);
router.get("/viewAttendanceOfAStud", auth, isStudent, viewAttendanceOfAStud);
<<<<<<< HEAD
router.get("/viewStudAttendanceForLec", auth, viewStudAttendanceForLec);
router.get("/attendAccToSub", auth, isStudent, attendAccToSub);
=======
router.get("/viewLectAttendance", auth, viewLectAttendance);
>>>>>>> c81fda7fc2400d50be15b80f79e019ce0f2b3fe5

module.exports = router;
