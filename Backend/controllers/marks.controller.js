const Marks = require("../models/marks.model");
const Lecture = require("../models/lecture.model");
const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.markStudentMarks = async (req, res) => {
	try {
		const { studentId, lectureId, marks, totalMarks, description } =
			req.body;
		const userId = req.user.id;

		if (!studentId || !lectureId || marks == null || !totalMarks) {
			return res.json(
				new ApiError(
					400,
					"All fields (studentId, lectureId, marks, totalMarks) are required."
				)
			);
		}

		if (
			isNaN(marks) ||
			isNaN(totalMarks) ||
			marks < 0 ||
			totalMarks <= 0 ||
			marks > totalMarks
		) {
			return res.json(
				new ApiError(
					400,
					"Invalid marks or totalMarks. Ensure marks are non-negative, totalMarks is positive, and marks do not exceed totalMarks."
				)
			);
		}

		const studentDetails = await User.findById(studentId);
		if (!studentDetails) {
			return res.json(new ApiError(404, "Student not found."));
		}

		const lectureDetails = await Lecture.findById(lectureId);
		if (!lectureDetails) {
			return res.json(new ApiError(404, "Lecture not found."));
		}
		if (lectureDetails.description !== "Test") {
			return res.json(
				new ApiError(
					400,
					"Marks can only be marked for lectures with the description 'Test'."
				)
			);
		}

		const marksDetails = await Marks.create({
			student: studentId,
			lecture: lectureId,
			subject: lectureDetails.subject._id,
			marks: marks,
			totalMarks: totalMarks,
			updatedBy: userId,
			description: description ? description : "",
		});

		// Update the lecture to set marksMarked to true
		await Lecture.findByIdAndUpdate(lectureId, { marksMarked: true });

		return res.json(
			new ApiResponse(200, marksDetails, "Marks marked successfully")
		);
	} catch (error) {
		console.log("Error in marking the marks for that student ", error);
		return res.json(
			new ApiError(500, "Error in marking the marks for that student ")
		);
	}
};

module.exports.editMarks = async (req, res) => {
	try {
		const { studentId, lectureId, marks, totalMarks, description } =
			req.body;

		if (!studentId || !lectureId || marks == null || !totalMarks) {
			return res.json(
				new ApiError(
					400,
					"All fields (studentId, lectureId, marks, totalMarks) are required."
				)
			);
		}

		if (
			isNaN(marks) ||
			isNaN(totalMarks) ||
			marks < 0 ||
			totalMarks <= 0 ||
			marks > totalMarks
		) {
			return res.json(
				new ApiError(
					400,
					"Invalid marks or totalMarks. Ensure marks are non-negative, totalMarks is positive, and marks do not exceed totalMarks."
				)
			);
		}

		const lectureDetails = await Lecture.findById(lectureId);
		if (!lectureDetails) {
			return res.json(new ApiError(404, "Lecture not found."));
		}

		const marksDetails = await Marks.findOne({
			student: studentId,
			lecture: lectureId,
		});

		if (!marksDetails) {
			return res.json(new ApiError(404, "Marks record not found."));
		}

		marksDetails.marks = marks;
		marksDetails.totalMarks = totalMarks;
		marksDetails.description = description
			? description
			: marksDetails.description;
		marksDetails.updatedBy = req.user.id;
		(marksDetails.subject = lectureDetails.subject._id),
			await marksDetails.save();

		return res.json(
			new ApiResponse(200, marksDetails, "Marks updated successfully")
		);
	} catch (error) {
		console.log("Error in editing the marks of that student ", error);
		return res.json(
			new ApiError(500, "Error in editing the marks of that student ")
		);
	}
};

module.exports.marksAccToSubject = async (req, res) => {
	try {
		const { subjectId } = req.body;
		const userId = req.user.id;

		if (!subjectId) {
			return res.json(
				new ApiError(
					400,
					"All fields (studentId, subjectId) are required."
				)
			);
		}

		const marksDetails = await Marks.find({
			student: userId,
			subject: subjectId,
		})
			.populate({ path: "lecture", populate: "subject" })
			.exec();

		if (!marksDetails || marksDetails.length === 0) {
			return res.json(
				new ApiError(404, "No marks data found for the student.")
			);
		}

		return res.json(
			new ApiResponse(200, marksDetails, "Marks fetched successfully")
		);
	} catch (error) {
		console.log(
			"Error in fetching marks according to the subject ",
			error
		);
		return res.json(
			new ApiError(
				500,
				"Error in fetching marks according to the subject "
			)
		);
	}
};

module.exports.trackStudentProgress = async (req, res) => {
	try {
		const userId = req.user.id;

		const marksDetails = await Marks.find({ student: userId })
			.populate({ path: "lecture", populate: "subject" })
			.exec();

		if (!marksDetails || marksDetails.length === 0) {
			return res.json(
				new ApiError(404, "No marks data found for the student.")
			);
		}

		let totalMarksObtained = 0;
		let totalMarksPossible = 0;

		marksDetails.forEach((mark) => {
			totalMarksObtained += mark.marks;
			totalMarksPossible += mark.totalMarks;
		});

		const progressPercentage =
			(totalMarksObtained / totalMarksPossible) * 100;

		return res.json(
			new ApiResponse(
				200,
				{ progressPercentage },
				"Progress tracked successfully"
			)
		);
	} catch (error) {
		console.log("Error in tracking student progress ", error);
		return res.json(
			new ApiError(500, "Error in tracking student progress")
		);
	}
};

module.exports.trackProgressBySubject = async (req, res) => {
   try {
      const { subjectId } = req.body;
      const userId = req.user.id;

      if (!subjectId) {
         return res.json(
            new ApiError(400, "Field (subjectId) is required.")
         );
      }

      const marksDetails = await Marks.find({
         student: userId,
         subject: subjectId,
      })
         .populate({ path: "lecture", populate: "subject" })
         .exec();

      if (!marksDetails || marksDetails.length === 0) {
         return res.json(
            new ApiError(404, "No marks data found for the student in this subject.")
         );
      }

      let totalMarksObtained = 0;
      let totalMarksPossible = 0;

      marksDetails.forEach((mark) => {
         totalMarksObtained += mark.marks;
         totalMarksPossible += mark.totalMarks;
      });

      const progressPercentage =
         (totalMarksObtained / totalMarksPossible) * 100;

      return res.json(
         new ApiResponse(
            200,
            { progressPercentage },
            "Progress by subject tracked successfully"
         )
      );
   } catch (error) {
      console.log("Error in tracking progress by subject ", error);
      return res.json(
         new ApiError(500, "Error in tracking progress by subject")
      );
   }
};


