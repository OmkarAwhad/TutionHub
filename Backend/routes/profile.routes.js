const express = require("express");
const { getProfileDetails } = require("../controllers/profile.controller");
const { auth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/getProfileDetails", auth, getProfileDetails);

module.exports = router;
