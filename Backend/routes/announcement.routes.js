const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	createAnnouncement,
	getAnnouncements,
	deleteAnnouncement,
} = require("../controllers/announcement.controller");

router.post("/createAnnouncement", auth, isAdmin, createAnnouncement);
router.get("/getAnnouncements", auth, getAnnouncements);
router.delete("/deleteAnnouncement", auth, isAdmin, deleteAnnouncement);

module.exports = router;
