const Attendance = require("../models/attendance.model");
const Lecture = require("../models/lecture.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.markAttendance = async (req, res) => {
  try {
    const { lectureId, studentId, status } = req.body;

    const lectureDetails = await Lecture.findById(lectureId);
    if (!lectureDetails) {
      return res.json(new ApiError(400, "Lecture not found"));
    }

    const studentDetails = await User.findById(studentId);
    if (!studentDetails) {
      return res.json(new ApiError(400, "Student not found"));
    }

    const attendanceDetails = await Attendance.create({
      status,
      lecture: lectureId,
      student: studentId,
    })
      .populate("student")
      .populate("lecture")
      .exec();

    return res.json(
      new ApiResponse(
        200,
        {
          attendanceDetails: attendanceDetails,
          LectureDate: lectureDetails.date,
        },
        "Attendance marked successfully"
      )
    );
  } catch (error) {
    console.log("Error in marking attendance ", error);
    return res.json(new ApiError(500, "Error in marking attendance "));
  }
};

module.exports.viewAttendanceOfAStud = async (req, res) => {
  try {
    const userId = req.user.id;

    const attendanceDetails = await Attendance.find({ student: userId })
      .populate("lecture")
      .exec();

    return res.json(
      new ApiResponse(
        200,
        attendanceDetails,
        "Student attendance fetched successfully"
      )
    );
  } catch (error) {
    console.log("Error in fetching student attendance ", error);
    return res.json(new ApiError(500, "Error in fetching student attendance "));
  }
};

module.exports.viewLectAttendance = async (req, res) => {
  try {
    if (req.user.role === "Student") {
      return res.json(
        new ApiError(400, "This is a protected route for admin and tutor")
      );
    }
    const { lectureId } = req.body;
    const attendanceDetails = await Attendance.find({ lecture: lectureId })
      .populate("student")
      .exec();

    return res.json(
      new ApiResponse(
        200,
        attendanceDetails,
        "Attendance according to a lecture fetched successfully"
      )
    );
  } catch (error) {
    console.log("Error in fetching attendance by lecture ", error);
    return res.json(
      new ApiError(500, "Error in fetching attendance by lecture ")
    );
  }
};

module.exports.attendAccToSub = async (req, res) => {
  try {
    const userId = req.user.id;

    

  } catch (error) {
    console.log("Error in fetching attendance acc to a subject ", error);
    return res.json(
      new ApiError(500, "Error in fetching attendance acc to a subject ")
    );
  }
};
