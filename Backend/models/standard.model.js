const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema({
	standardName: {
		type: String,
	},
});

module.exports = mongoose.model("Standard", standardSchema);
