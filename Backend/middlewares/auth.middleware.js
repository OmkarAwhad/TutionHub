const jwt = require("jsonwebtoken");
const express = require("express");
const { ApiError } = require("../utils/ApiError.utils");
require("dotenv").config();

exports.auth = async (req, res, next) => {
	try {
		const token =
			(req.header("Authorization") &&
				req.header("Authorization").replace("Bearer ", "")) ||
			req.headers.token ||
			req.cookies.token;

		// console.log("Token ", token);

		if (!token) {
			return res.json(
				new ApiError(400, "Not authorized, Login Again")
			);
		}  

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			// console.log("Decode ", decode);
			req.user = decode;
		} catch (error) {
			return res.json(new ApiError(401, "Invalid token"));
		}

		next();
	} catch (error) {
		console.log(
			"Something went wrong while validating the token ",
			error.message
		);
		return res.json(
			new ApiError(
				500,
				"Something went wrong while validating the token"
			)
		);
	}
};

exports.isStudent = async (req, res, next) => {
	try {
		const { role } = req.user;
		if (role !== "Student") {
			return res.json(
				new ApiError(
					401,
					"This is a protected route for students only"
				)
			);
		}
	} catch (error) {
		console.log("Error in student auth ", error.message);
		return res.json(new ApiError(500, "Error in student auth"));
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const { role } = req.user;
		if (role !== "Admin") {
			return res.json(
				new ApiError(
					401,
					"This is a protected route for admins only"
				)
			);
		}
		next();
	} catch (error) {
		console.log("Error in admin auth ", error.message);
		return res.json(new ApiError(500, "Error in admin auth"));
	}
};

exports.isTutor = async (req, res, next) => {
	try {
		const { role } = req.user;
		if (role !== "Tutor") {
			return res.json(
				new ApiError(
					401,
					"This is a protected route for tutors only"
				)
			);
		}
		next();
	} catch (error) {
		console.log("Error in tutor auth ", error.message);
		return res.json(new ApiError(500, "Error in tutor auth"));
	}
};
