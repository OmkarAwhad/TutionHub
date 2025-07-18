const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth.middleware");
const {
	getAllStandards,
	getStandardById,
	createStandard,
} = require("../controllers/standard.controller");

router.get("/getAllStandards", auth, getAllStandards);
router.get("/getStandardById/:id", auth, getStandardById);
router.post("/createStandard", auth, isAdmin, createStandard);

module.exports = router;
