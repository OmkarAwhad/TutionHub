const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	day:{
		type:String,
	},
	tutor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	subject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject",
	},
});

module.exports = mongoose.model("Lecture", lectureSchema);
