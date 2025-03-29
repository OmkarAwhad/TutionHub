const Attendance = require("../models/attendance.model");
const User = require("../models/user.model");

module.exports.markAttendance = async (req, res) => {
	try {
	} catch (error) {
		console.log("Error in marking attendance ", error);
		return res.json(new ApiError(500, "Error in marking attendance "));
	}
};
