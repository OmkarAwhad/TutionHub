const express = require("express");
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const { createLecture } = require("../controllers/lecture.controller");
const router = express.Router();

router.post("/createLecture", auth, isAdmin, createLecture);

module.exports = router;
