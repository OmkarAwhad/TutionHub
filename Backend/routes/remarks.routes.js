const express = require("express");
const { auth, isTutor, isStudent } = require("../middlewares/auth.middleware");
const {
   addARemark,
   viewRemarks,
   // viewRemarkssForSubject,
} = require("../controllers/remarks.controller");

const router = express.Router();

router.post("/addARemark", auth, isTutor, addARemark);
router.get("/viewRemarks", auth, viewRemarks); // for students
router.get("/viewRemarks/:userId", auth, viewRemarks); // for admin
// router.get("/viewRemarkssForSubject/:subjectId", auth, isTutor,viewRemarkssForSubject);

module.exports = router;
