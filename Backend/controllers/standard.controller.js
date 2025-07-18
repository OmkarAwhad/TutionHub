const Standard = require("../models/standard.model");
const { ApiError } = require("../utils/ApiError.utils");
const { ApiResponse } = require("../utils/ApiResponse.utils");
require("dotenv").config();

module.exports.getAllStandards = async (req, res) => {
	try {
		const standards = await Standard.find({}).exec();

		return res.json(
			new ApiResponse(
				200,
				{ standards: standards },
				"Standards fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching standards ", error);
		return res.json(new ApiError(500, "Error in fetching standards "));
	}
};

module.exports.createStandard = async (req, res) => {
	try {
		const { standardName } = req.body;

		if (!standardName) {
			return res.json(new ApiError(400, "Standard name is required"));
		}

		const newStandard = await Standard.create({ standardName });

		return res.json(
			new ApiResponse(
				201,
				{ standard: newStandard },
				"Standard created successfully"
			)
		);
	} catch (error) {
		if (error.name === "ValidationError") {
			const message = Object.values(error.errors)
				.map((err) => err.message)
				.join(", ");
			return res.json(
				new ApiError(400, `Validation Error: ${message}`)
			);
		}

		console.log("Error in creating standard ", error);
		return res.json(new ApiError(500, "Error in creating standard"));
	}
};

module.exports.getStandardById = async (req, res) => {
	try {
		const { id } = req.params;

		const standard = await Standard.findById(id).exec();

		if (!standard) {
			return res.json(new ApiError(404, "Standard not found"));
		}

		return res.json(
			new ApiResponse(
				200,
				{ standard: standard },
				"Standard fetched successfully"
			)
		);
	} catch (error) {
		console.log("Error in fetching standard ", error);
		return res.json(new ApiError(500, "Error in fetching standard "));
	}
};

