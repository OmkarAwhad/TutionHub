const express = require("express");
const router = express.Router();
const { auth, isTutor } = require("../middlewares/auth.middleware"); // Assuming you have auth middleware
const {
	uploadNotes,
	getAllNotes,
	getNotesBySubject,
	deleteNote,
} = require("../controllers/notes.controller");

router.post("/uploadNotes", auth, isTutor, uploadNotes);
router.get("/getAllNotes", auth, getAllNotes);
router.get("/getNotesBySubject", auth, getNotesBySubject);
router.delete("/deleteNote", auth, isTutor, deleteNote);

module.exports = router;
