const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	getAllStandards,
	getStandardById,
	createStandard,
	assignStandardToStudent,
	getMyStandard,
} = require("../controllers/standard.controller");

router.get("/getAllStandards", auth, getAllStandards);
router.get("/getStandardById/:standardId", auth, getStandardById);
router.post("/createStandard", auth, isAdmin, createStandard);
router.post("/assignStandardToStudent", auth, isAdmin, assignStandardToStudent);
router.get("/getMyStandard", auth, getMyStandard);

module.exports = router;
