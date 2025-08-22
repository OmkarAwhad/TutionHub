const express = require("express");
const router = express.Router();

const {
	signUp,
	login,
	removeUser,
	deleteMyAccount,
	forgetPassword,
	verifyOTP,
	changePassword,
} = require("../controllers/auth.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

router.post("/signUp", signUp);
router.post("/login", login);
router.delete("/removeUser", auth, isAdmin, removeUser);
router.delete("/deleteMyAccount", auth, deleteMyAccount);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);

module.exports = router;
