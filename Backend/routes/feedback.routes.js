const express = require("express");
const router = express.Router();

const { auth, isAdmin, isStudent } = require("../middlewares/auth.middleware");
const {
	makeAFeedback,
	myFeedbacks,
	allFeedbacks,
} = require("../controllers/feedback.controller");

router.post("/makeAFeedback", auth, isStudent, makeAFeedback);
router.get("/myFeedbacks", auth, isStudent, myFeedbacks);
router.get("/allFeedbacks", auth, isAdmin, allFeedbacks);

module.exports = router;
