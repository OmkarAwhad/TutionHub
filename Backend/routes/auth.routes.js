const express = require("express");
const router = express.Router();

const { signUp, login, removeUser } = require("../controllers/auth.controller");
const { auth, isAdmin } = require("../middlewares/auth.middleware");

router.post("/signUp", signUp);
router.post("/login", login);
router.delete("/removeUser", auth, isAdmin, removeUser);

module.exports = router;
