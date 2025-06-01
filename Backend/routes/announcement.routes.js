const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	createAnnouncement,
	getMyAnnouncements,
	deleteAnnouncement,
	getAllAnnouncements,
} = require("../controllers/announcement.controller");

router.post("/createAnnouncement", auth, isAdmin, createAnnouncement);
router.get("/getMyAnnouncements", auth, getMyAnnouncements);
router.get("/getAllAnnouncements", auth, getAllAnnouncements);
router.delete("/deleteAnnouncement", auth, isAdmin, deleteAnnouncement);

module.exports = router;
