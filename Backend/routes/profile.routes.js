const express = require("express");
const {
	getProfileDetails,
	updateProfile,
} = require("../controllers/profile.controller");
const { auth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/getProfileDetails", auth, getProfileDetails);
router.post("/updateProfile", auth, updateProfile);

module.exports = router;
