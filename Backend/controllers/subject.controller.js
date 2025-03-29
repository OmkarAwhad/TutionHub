const Subject = require("../models/subject.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");

module.exports.createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.json(new ApiError(400, "Name and code both are required"));
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

	

  } catch (error) {
    console.log("Error in fetching subjects of that student ", error);
    return res.json(
      new ApiError(500, "Error in fetching subjects of that student ")
    );
  }
};
