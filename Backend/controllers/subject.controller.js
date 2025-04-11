const Subject = require("../models/subject.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
const User = require("../models/user.model");

module.exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.json(new ApiError(400, "Name and code both are required"));
    }

		const alreadyMade = await Subject.findOne({ name: name, code: code });
		if (alreadyMade) {
			return res.json(
				new ApiError(
					400,
					"Subject with the same name and code already exists"
				)
			);
		}

		const subjectDetails = await Subject.create({
			name: name,
			code: code,
		});


    return res.json(
      new ApiResponse(200, subjectDetails, "Subject Created successfully")
    );
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0]; // Get the field causing the error
      const duplicateValue = error.keyValue[duplicateField]; // Get the duplicate value
      return res.json(
        new ApiError(
          400,
          `Duplicate value for ${duplicateField}: '${duplicateValue}'. Please use a unique value.`
        )
      );
    }
    console.log("Error in creating subject ", error);
    return res.json(new ApiError(500, "Error in creating subject "));
  }
};

module.exports.updateSubject = async (req, res) => {
  try {
    const { subjectId, name, code } = req.body;

    if (!subjectId || !name || !code) {
      return res.json(
        new ApiError(400, "Subject ID, name, and code are required")
      );
    }

    const subjectDetails = await Subject.findById(subjectId);

    subjectDetails.name = name;
    subjectDetails.code = code;

    await subjectDetails.save();

    return res.json(new ApiResponse(200, {}, "Subject updated successfully"));
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0]; // Get the field causing the error
      const duplicateValue = error.keyValue[duplicateField]; // Get the duplicate value
      return res.json(
        new ApiError(
          400,
          `Duplicate value for ${duplicateField}: '${duplicateValue}'. Please use a unique value.`
        )
      );
    }
    console.log("Error in updating subject ", error);
    return res.json(new ApiError(500, "Error in updating subject "));
  }
};

module.exports.deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.body;
    await Subject.findByIdAndDelete(subjectId);
    return res.json(new ApiResponse(200, {}, "Subject deleted successfully"));
  } catch (error) {
    console.log("Error in deleting subject ", error);
    return res.json(new ApiError(500, "Error in deleting subject "));
  }
};

module.exports.getAllSubjects = async (req, res) => {
  try {
    const allSubjectDetails = await Subject.find({});
    return res.json(
      new ApiResponse(200, allSubjectDetails, "All subject details fetched")
    );
  } catch (error) {
    console.log("Error in fetching all subjects ", error);
    return res.json(new ApiError(500, "Error in fetching all subjects "));
  }
};

module.exports.subsOfThatStud = async (req, res) => {
  try {
	const userId = req.user.id;

	const subDetails = await User.findById(userId).populate('subjects').exec();
  if (!subDetails) {
    return res.json(
      new ApiError(404, "No subjects found for the given student")
    );
  }

  return res.json(
    new ApiResponse(200, subDetails.subjects, "Subjects fetched successfully")
  );

  } catch (error) {
    console.log("Error in fetching subjects of that student ", error);
    return res.json(
      new ApiError(500, "Error in fetching subjects of that student ")
    );
  }
};

module.exports.assignSubject = async (req, res) => {
	try {
		// const userId = req.user.id;
		const { subjects, studentId } = req.body;

		const validatedSubjectIds = [];

		for (const subjectName of subjects) {
			const subDetails = await Subject.findOne({ name: subjectName });
			if (!subDetails) {
				return res.json(
					new ApiError(
						404,
						`Subject ${subjectName} does not exist in DB`
					)
				);
			}

			validatedSubjectIds.push(subDetails._id);
		}

		const updatedUser = await User.findByIdAndUpdate(
			studentId,
			{ $addToSet: { subjects: { $each: validatedSubjectIds } } },
			{ new: true }
		).populate("subjects");

		return res.json(
			new ApiResponse(
				200,
				updatedUser,
				"Subjects assigned successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching subjects of that student ", error);
		return res.json(
			new ApiError(500, "Error in fetching subjects of that student ")
		);
	}
};
