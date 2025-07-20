const Lecture = require("../models/lecture.model");
const Subject = require("../models/subject.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const Marks = require("../models/marks.model");

module.exports.createLecture = async (req, res) => {
	try {
		const { date, time, tutor, subject, description, standardId } =
			req.body;

		if (
			!date ||
			!time ||
			!tutor ||
			!subject ||
			!description ||
			!standardId
		) {
			return res.json(new ApiError(400, "All fields are required"));
		}

		const lectureExists = await Lecture.findOne({
			date: date,
			time: time,
		});
		if (lectureExists) {
			return res.json(
				new ApiError(
					400,
					"Lecture already exists at the given date and time"
				)
			);
		}

		const inputDate = new Date(date);
		const todaysDate = new Date();
		todaysDate.setHours(0, 0, 0, 0);

		if (inputDate < todaysDate) {
			return res.json(new ApiError(400, "Date cannot be in the past"));
		}

		const tutorDetails = await User.findById(tutor);
		if (!tutorDetails) {
			return res.json(new ApiError(404, "Tutor not found"));
		}

		const subjectDetails = await Subject.findById(subject);
		if (!subjectDetails) {
			return res.json(new ApiError(404, "Subject not found"));
		}

		const dayOfWeek = inputDate.toLocaleString("en-US", {
			weekday: "long",
		});

		const lectureDetails = await Lecture.create({
			date: inputDate,
			time: time,
			tutor: tutorDetails._id,
			standard: standardId,
			subject: subjectDetails._id,
			day: dayOfWeek,
			description: description,
		});

		return res.json(
			new ApiResponse(
				201,
				lectureDetails,
				"Lecture created successfully"
			)
		);
	} catch (error) {
		console.log("Error in creating a lecture ", error);
		return res.json(new ApiError(500, "Error in creating a lecture "));
	}
};

module.exports.getLecturesOfWeek = async (req, res) => {
	try {
		const weekStart = new Date();
		weekStart.setHours(0, 0, 0, 0);
		weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sets date to the start of the week (Sunday)

		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekEnd.getDate() + 6);
		weekEnd.setHours(23, 59, 59, 999);

		const lectures = await Lecture.find({
			date: {
				$gte: weekStart, // Greater than or equal to week start
				$lte: weekEnd, // Less than or equal to week end
			},
		})
			.populate("tutor")
			.populate("subject")
			.exec();

		const lectByDay = {
			Sunday: [],
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
		};

		lectures.forEach((lect) => {
			const day = lect.day;
			if (lectByDay[day]) {
				lectByDay[day].push({
					_id: lect._id,
					student: lect.student,
					tutor: lect.tutor,
					date: lect.date,
					day: lect.day,
					time: lect.time,
					description: lect.description,
				});
			}
		});

		// Sort lectures in each day's array by time
		Object.keys(lectByDay).forEach((day) => {
			lectByDay[day].sort((a, b) => {
				const parseTime = (time) => {
					const [hourMinute, period] = time.split(" ");
					let [hours, minutes] = hourMinute
						.split(":")
						.map(Number);
					if (period === "PM" && hours !== 12) hours += 12;
					if (period === "AM" && hours === 12) hours = 0;
					return hours * 60 + minutes; // Convert to total minutes
				};
				return (
					parseTime(a.time.split(" to ")[0]) -
					parseTime(b.time.split(" to ")[0])
				);
			});
		});

		return res.json(
			new ApiResponse(
				200,
				{
					weekStart: weekStart.toISOString().split("T")[0],
					weekEnd: weekEnd.toISOString().split("T")[0],
					lectures: lectByDay,
				},
				"Lectures fetched and grouped by day for the week successfully"
			)
		);
	} catch (error) {
		console.log("Error in getting all lectures of a week ", error);
		return res.json(
			new ApiError(500, "Error in getting all lectures of a week ")
		);
	}
};

module.exports.getLectByDesc = async (req, res) => {
	try {
		const { description } = req.query; // Read from query parameters

		if (!description) {
			return res.json(new ApiError(400, "Description is required"));
		}

		const details = await Lecture.find({ description })
			.populate("tutor")
			.populate("subject")
			.exec();

		return res.json(
			new ApiResponse(200, details, "Test days fetched successfully")
		);
	} catch (error) {
		console.log("Error fetching Test days schedule ", error);
		return res.json(
			new ApiError(500, "Error fetching Test days schedule ")
		);
	}
};

module.exports.updateLecture = async (req, res) => {
	try {
		const { lectureId } = req.params;
		const { date, time, tutor, subject, description, standardId } =
			req.body;

		const lecture = await Lecture.findById(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		if (date) {
			const inputDate = new Date(date);
			const todaysDate = new Date();
			todaysDate.setHours(0, 0, 0, 0);

			if (inputDate < todaysDate) {
				return res.json(
					new ApiError(400, "Date cannot be in the past")
				);
			}
			lecture.date = inputDate;
			lecture.day = inputDate.toLocaleString("en-US", {
				weekday: "long",
			});
		}

		if (time) lecture.time = time;
		if (tutor) {
			const tutorDetails = await User.findById(tutor);
			if (!tutorDetails) {
				return res.json(new ApiError(404, "Tutor not found"));
			}
			lecture.tutor = tutorDetails._id;
		}
		if (subject) {
			const subjectDetails = await Subject.findById(subject);
			if (!subjectDetails) {
				return res.json(new ApiError(404, "Subject not found"));
			}
			lecture.subject = subjectDetails._id;
		}
		if (description) lecture.description = description;
		if (standardId) lecture.standard = standardId;

		await lecture.save();

		return res.json(
			new ApiResponse(200, lecture, "Lecture updated successfully")
		);
	} catch (error) {
		console.log("Error in updating lecture: ", error);
		return res.json(new ApiError(500, "Error in updating lecture"));
	}
};

module.exports.deleteLecture = async (req, res) => {
	try {
		const { lectureId } = req.body;

		const lecture = await Lecture.findByIdAndDelete(lectureId);
		if (!lecture) {
			return res.json(new ApiError(404, "Lecture not found"));
		}

		// Delete all attendance records for this lecture
		await require("../models/attendance.model").deleteMany({
			lecture: lectureId,
		});

		// If the lecture is a Test, delete all marks for this lecture
		if (lecture.description === "Test") {
			await require("../models/marks.model").deleteMany({
				lecture: lectureId,
			});
		}

		return res.json(
			new ApiResponse(200, null, "Lecture deleted successfully")
		);
	} catch (error) {
		console.log("Error in deleting lecture: ", error);
		return res.json(new ApiError(500, "Error in deleting lecture"));
	}
};

module.exports.getAllLectures = async (req, res) => {
	try {
		const lectures = await Lecture.find()
			.populate("tutor")
			.populate("subject")
			.populate("standard")
			.sort({ date: -1, time: 1 });

		// Add marksMarked property to indicate if marks are marked for the lecture
		const lecturesWithMarksStatus = await Promise.all(
			lectures.map(async (lecture) => {
				const marksExist = await Marks.exists({
					lecture: lecture._id,
				});
				return {
					...lecture.toObject(),
					marksMarked: !!marksExist, // Ensure boolean value
				};
			})
		);

		return res.json(
			new ApiResponse(
				200,
				lecturesWithMarksStatus,
				"All lectures fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in getting all lectures: ", error);
		return res.json(new ApiError(500, "Error in getting all lectures"));
	}
};

module.exports.getLectureBySub = async (req, res) => {
	try {
		const { subjectId } = req.query;

		if (!subjectId) {
			return res.json(new ApiError(400, "Subject ID is required"));
		}

		const lectureDetails = await Lecture.find({ subject: subjectId })
			.populate("tutor")
			.populate("subject")
			.sort({ date: -1, time: 1 })
			.exec();

		if (!lectureDetails || lectureDetails.length === 0) {
			return res.json(
				new ApiResponse(
					200,
					[],
					"No lectures found for this subject"
				)
			);
		}

		return res.json(
			new ApiResponse(
				200,
				lectureDetails,
				"Lectures fetched successfully for the given subject"
			)
		);
	} catch (error) {
		console.log("Error in getting all lectures by subject: ", error);
		return res.json(
			new ApiError(500, "Error in getting all lectures by subject")
		);
	}
};

module.exports.getMyLecturesByDate = async (req, res) => {
   try {
      const { date, fetchWeek = true } = req.body;

      // Validate input
      if (!date) {
         return res.json(new ApiError(400, "Date is required"));
      }

      const userId = req.user.id;
      const userDetails = await User.findById(userId).populate("profile").exec();
      if (!userDetails) {
         return res.json(new ApiError(404, "User not found"));
      }
      
      const standardId = userDetails.profile?.standard; // 👈 Add optional chaining
      if (!standardId) {
         return res.json(new ApiError(400, "User has no standard assigned"));
      }

      // Parse and validate date
      const inputDate = new Date(date);
      if (isNaN(inputDate)) {
         return res.json(
            new ApiError(400, "Invalid date format. Use YYYY-MM-DD")
         );
      }
      inputDate.setHours(0, 0, 0, 0);

      let weekStart, weekEnd;

      if (fetchWeek) {
         // Calculate week start (Sunday) and end (Saturday)
         weekStart = new Date(inputDate);
         weekStart.setDate(weekStart.getDate() - weekStart.getDay());

         weekEnd = new Date(weekStart);
         weekEnd.setDate(weekEnd.getDate() + 6);
         weekEnd.setHours(23, 59, 59, 999);
      } else {
         // Fetch lectures for the specific date
         weekStart = new Date(inputDate);
         weekEnd = new Date(inputDate);
         weekEnd.setHours(23, 59, 59, 999);
      }

      // 👈 Query lectures with all populated fields including standard
      const lectures = await Lecture.find({
         date: {
            $gte: weekStart,
            $lte: weekEnd,
         },
         standard: standardId,
      })
         .populate("tutor", "name email") // 👈 Select specific fields
         .populate("subject", "name code")
         .populate("standard", "standardName") // 👈 Add standard population
         .exec();

      // If no lectures found, return empty structure
      if (lectures.length === 0) {
         return res.json(
            new ApiResponse(
               200,
               {
                  weekStart: weekStart.toISOString().split("T")[0],
                  weekEnd: weekEnd.toISOString().split("T")[0],
                  lectures: {
                     Sunday: [],
                     Monday: [],
                     Tuesday: [],
                     Wednesday: [],
                     Thursday: [],
                     Friday: [],
                     Saturday: [],
                  },
               },
               `No lectures found for the specified ${
                  fetchWeek ? "week" : "date"
               }`
            )
         );
      }

      // Group lectures by day
      const lectByDay = {
         Sunday: [],
         Monday: [],
         Tuesday: [],
         Wednesday: [],
         Thursday: [],
         Friday: [],
         Saturday: [],
      };

      // Helper function to get day name from date
      const getDayName = (date) => {
         const days = [
            "Sunday",
            "Monday", 
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
         ];
         return days[new Date(date).getDay()];
      };

      // Process each lecture
      lectures.forEach((lect) => {
         const day = getDayName(lect.date);
         lectByDay[day].push({
            _id: lect._id,
            tutor: lect.tutor,
            date: lect.date,
            standard: lect.standard, // 👈 Now populated with standardName
            day,
            time: lect.time,
            description: lect.description,
            subject: lect.subject,
            marksMarked: lect.marksMarked,
            // 👈 Removed student field as it seems unused in this context
         });
      });

      // Sort lectures by start time within each day
      Object.keys(lectByDay).forEach((day) => {
         lectByDay[day].sort((a, b) => {
            const parseTime = (timeStr) => {
               try {
                  const startTime = timeStr.split(" to ")[0].trim();
                  const [hourMinute, period] = startTime.split(" ");
                  let [hours, minutes] = hourMinute.split(":").map(Number);
                  
                  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
                  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
                  
                  return hours * 60 + minutes;
               } catch (error) {
                  console.error(`Error parsing time: ${timeStr}`, error);
                  return 0;
               }
            };
            return parseTime(a.time) - parseTime(b.time);
         });
      });

      return res.json(
         new ApiResponse(
            200,
            {
               weekStart: weekStart.toISOString().split("T")[0],
               weekEnd: weekEnd.toISOString().split("T")[0],
               lectures: lectByDay,
            },
            `Lectures fetched and grouped by day for the specified ${
               fetchWeek ? "week" : "date"
            } successfully`
         )
      );
   } catch (error) {
      console.error("Error fetching lectures:", error);
      return res.json(
         new ApiError(
            500,
            "Internal server error while fetching lectures"
         )
      );
   }
};

module.exports.getTutorLecturesByDate = async (req, res) => {
	try {
		const { date, fetchWeek = true } = req.body;
		const tutorId = req.user.id;

		if (!tutorId) {
			return res.json(
				new ApiError(401, "Unauthorized: Tutor not found")
			);
		}

		if (!date) {
			return res.json(new ApiError(400, "Date is required"));
		}

		const inputDate = new Date(date);
		if (isNaN(inputDate)) {
			return res.json(
				new ApiError(400, "Invalid date format. Use YYYY-MM-DD")
			);
		}
		inputDate.setHours(0, 0, 0, 0);

		let weekStart, weekEnd;

		if (fetchWeek) {
			weekStart = new Date(inputDate);
			weekStart.setDate(weekStart.getDate() - weekStart.getDay());

			weekEnd = new Date(weekStart);
			weekEnd.setDate(weekEnd.getDate() + 6);
			weekEnd.setHours(23, 59, 59, 999);
		} else {
			weekStart = new Date(inputDate);
			weekEnd = new Date(inputDate);
			weekEnd.setHours(23, 59, 59, 999);
		}

		const lectures = await Lecture.find({
			date: {
				$gte: weekStart,
				$lte: weekEnd,
			},
			tutor: tutorId,
		})
			.populate("tutor")
			.populate("subject")
			.exec();

		if (lectures.length === 0) {
			return res.json(
				new ApiResponse(
					200,
					{
						weekStart: weekStart.toISOString().split("T")[0],
						weekEnd: weekEnd.toISOString().split("T")[0],
						lectures: {
							Sunday: [],
							Monday: [],
							Tuesday: [],
							Wednesday: [],
							Thursday: [],
							Friday: [],
							Saturday: [],
						},
					},
					`No lectures found for the specified ${
						fetchWeek ? "week" : "date"
					}`
				)
			);
		}

		const lectByDay = {
			Sunday: [],
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
		};

		const getDayName = (date) => {
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			return days[new Date(date).getDay()];
		};

		lectures.forEach((lect) => {
			const day = getDayName(lect.date);
			lectByDay[day].push({
				_id: lect._id,
				student: lect.student,
				tutor: lect.tutor,
				date: lect.date,
				day,
				time: lect.time,
				description: lect.description,
				subject: lect.subject,
				marksMarked: lect.marksMarked,
			});
		});

		Object.keys(lectByDay).forEach((day) => {
			lectByDay[day].sort((a, b) => {
				const parseTime = (timeStr) => {
					try {
						const startTime = timeStr.split(" to ")[0].trim();
						const [hourMinute, period] = startTime.split(" ");
						let [hours, minutes = 0] = hourMinute
							.split(":")
							.map(Number);
						if (
							period &&
							period.toUpperCase() === "PM" &&
							hours !== 12
						)
							hours += 12;
						if (
							period &&
							period.toUpperCase() === "AM" &&
							hours === 12
						)
							hours = 0;
						return hours * 60 + minutes;
					} catch (error) {
						console.error(
							`Error parsing time: ${timeStr}`,
							error
						);
						return 0;
					}
				};
				return parseTime(a.time) - parseTime(b.time);
			});
		});

		return res.json(
			new ApiResponse(
				200,
				{
					weekStart: weekStart.toISOString().split("T")[0],
					weekEnd: weekEnd.toISOString().split("T")[0],
					lectures: lectByDay,
				},
				`Lectures fetched and grouped by day for the specified ${
					fetchWeek ? "week" : "date"
				} successfully`
			)
		);
	} catch (error) {
		console.error("Error fetching tutor lectures:", error);
		return res.json(
			new ApiError(
				500,
				"Internal server error while fetching tutor lectures"
			)
		);
	}
};
