const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
	mongoose
		.connect(process.env.DB_URL)
		.then(() => console.log("Connected to DB"))
		.catch((err) => {
			console.log("Error connecting to DB", err);
			process.exit(1);
		});
};
