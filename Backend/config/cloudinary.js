// // cloudinary.js
// const cloudinary = require("cloudinary").v2;
// const fs = require("fs").promises;

// // Configure Cloudinary
// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadToCloudinary = async (filePath) => {
// 	try {
// 		const result = await cloudinary.uploader.upload(filePath, {
// 			folder: process.env.CLOUDINARY_FOLDER,
// 			resource_type: "auto",
// 			use_filename: true,
// 			unique_filename: true,
// 		});

// 		// Delete local file after successful upload
// 		try {
// 			await fs.unlink(filePath);
// 		} catch (unlinkError) {
// 			console.warn(
// 				"Could not delete local file:",
// 				unlinkError.message
// 			);
// 		}

// 		return result.secure_url;
// 	} catch (error) {
// 		// Delete local file even if upload fails
// 		try {
// 			await fs.unlink(filePath);
// 		} catch (unlinkError) {
// 			console.warn(
// 				"Could not delete local file after failed upload:",
// 				unlinkError.message
// 			);
// 		}
// 		throw error;
// 	}
// };

// /**
//  * Stream a buffer directly to Cloudinary.
//  * @param {Buffer} buffer  – file buffer from multer.memoryStorage()
//  * @param {String} folder  – Cloudinary folder (optional)
//  * @param {String} name    – original filename (optional)
//  * @returns {Promise<String>} secure_url
//  */
// const uploadBuffer = (buffer, folder = "", name = "") =>
// 	new Promise((resolve, reject) => {
// 		const stream = cloudinary.uploader.upload_stream(
// 			{
// 				folder,
// 				resource_type: "auto",
// 				use_filename: true,
// 				unique_filename: true,
// 				public_id: name ? name.split(".")[0] : undefined,
// 			},
// 			(error, result) =>
// 				error ? reject(error) : resolve(result.secure_url)
// 		);
// 		streamifier.createReadStream(buffer).pipe(stream);
// 	});

// /**
//  * Enhanced function to extract public ID from Cloudinary URL
//  * @param {string} cloudinaryUrl - The Cloudinary URL
//  * @returns {string|null} - The extracted public ID
//  */
// const extractPublicIdFromUrl = (cloudinaryUrl) => {
// 	if (!cloudinaryUrl || typeof cloudinaryUrl !== "string") {
// 		console.log("Invalid URL provided");
// 		return null;
// 	}

// 	try {
// 		const url = new URL(cloudinaryUrl);
// 		const pathname = url.pathname;

// 		// Pattern: /image/upload/v1234567890/folder/filename.ext
// 		// or: /image/upload/folder/filename.ext
// 		// or: /raw/upload/v1234567890/folder/filename.ext

// 		const uploadMatch = pathname.match(
// 			/\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/
// 		);
// 		if (uploadMatch) {
// 			let publicId = uploadMatch[2];

// 			// Remove file extension
// 			publicId = publicId.replace(/\.[^/.]+$/, "");

// 			console.log("Extracted public ID:", publicId);
// 			return publicId;
// 		}

// 		console.log("Could not match upload pattern in URL:", cloudinaryUrl);
// 		return null;
// 	} catch (error) {
// 		console.error("Error extracting public ID:", error);
// 		return null;
// 	}
// };

// /**
//  * Enhanced deletion function with better error handling
//  * @param {string} fileUrl - The Cloudinary URL
//  * @returns {Promise<boolean>} - Success status
//  */
// const deleteFileFromCloudinary = async (fileUrl) => {
// 	if (!fileUrl || typeof fileUrl !== "string") {
// 		console.log("Invalid file URL provided for deletion");
// 		return false;
// 	}

// 	if (!fileUrl.includes("cloudinary.com")) {
// 		console.log("Not a Cloudinary URL:", fileUrl);
// 		return false;
// 	}

// 	try {
// 		const publicId = extractPublicIdFromUrl(fileUrl);
// 		if (!publicId) {
// 			console.log("Could not extract public ID from URL:", fileUrl);
// 			return false;
// 		}

// 		// Determine resource type from URL
// 		let resourceType = "auto";
// 		if (fileUrl.includes("/image/upload/")) {
// 			resourceType = "image";
// 		} else if (fileUrl.includes("/video/upload/")) {
// 			resourceType = "video";
// 		} else if (fileUrl.includes("/raw/upload/")) {
// 			resourceType = "raw";
// 		}

// 		console.log(
// 			`Attempting to delete: ${publicId} with resource_type: ${resourceType}`
// 		);

// 		// Try deletion with detected resource type first
// 		try {
// 			const result = await cloudinary.uploader.destroy(publicId, {
// 				resource_type: resourceType,
// 				invalidate: true,
// 			});

// 			console.log("Deletion result:", result);

// 			if (result && result.result === "ok") {
// 				console.log("Successfully deleted file from Cloudinary");
// 				return true;
// 			} else if (result && result.result === "not found") {
// 				console.log(
// 					"File was not found in Cloudinary (may have been already deleted)"
// 				);
// 				return true; // Consider this a success since the file is gone
// 			}
// 		} catch (deleteError) {
// 			console.log(
// 				`Failed with resource_type ${resourceType}:`,
// 				deleteError.message
// 			);
// 		}

// 		// If that didn't work, try all resource types
// 		const resourceTypes = ["image", "video", "raw"];
// 		for (const type of resourceTypes) {
// 			if (type === resourceType) continue; // Skip the one we already tried

// 			try {
// 				console.log(`Trying with resource_type: ${type}`);
// 				const result = await cloudinary.uploader.destroy(publicId, {
// 					resource_type: type,
// 					invalidate: true,
// 				});

// 				console.log(`Result with ${type}:`, result);

// 				if (
// 					result &&
// 					(result.result === "ok" ||
// 						result.result === "not found")
// 				) {
// 					console.log(
// 						`Successfully deleted with resource_type: ${type}`
// 					);
// 					return true;
// 				}
// 			} catch (error) {
// 				console.log(
// 					`Failed with resource_type ${type}:`,
// 					error.message
// 				);
// 			}
// 		}

// 		// Try with the Admin API as a last resort
// 		try {
// 			console.log("Trying Admin API deletion...");
// 			const adminResult = await cloudinary.api.delete_resources(
// 				[publicId],
// 				{
// 					resource_type: "auto",
// 					invalidate: true,
// 				}
// 			);

// 			console.log("Admin API result:", adminResult);

// 			if (
// 				adminResult &&
// 				adminResult.deleted &&
// 				adminResult.deleted[publicId] === "deleted"
// 			) {
// 				console.log("Successfully deleted using Admin API");
// 				return true;
// 			}
// 		} catch (adminError) {
// 			console.log("Admin API deletion failed:", adminError.message);
// 		}

// 		console.log("All deletion methods failed");
// 		return false;
// 	} catch (error) {
// 		console.error("Error in deleteFileFromCloudinary:", error);
// 		return false;
// 	}
// };

// /**
//  * Force delete with multiple strategies
//  * @param {string} fileUrl - The Cloudinary URL
//  * @returns {Promise<boolean>} - Success status
//  */
// const forceDeleteCloudinaryFile = async (fileUrl) => {
// 	console.log("Force delete attempting to remove:", fileUrl);

// 	// Try the standard deletion first
// 	const standardResult = await deleteFileFromCloudinary(fileUrl);
// 	if (standardResult) {
// 		console.log("Standard deletion succeeded");
// 		return true;
// 	}

// 	// If standard deletion failed, try more aggressive approaches
// 	try {
// 		const publicId = extractPublicIdFromUrl(fileUrl);
// 		if (!publicId) {
// 			console.log("Could not extract public ID for force deletion");
// 			return false;
// 		}

// 		// Try different variations of the public ID
// 		const variations = [
// 			publicId,
// 			publicId.replace(/^[^/]+\//, ""), // Remove first folder
// 			`${process.env.CLOUDINARY_FOLDER}/${publicId}`,
// 			publicId.split("/").pop(), // Just the filename
// 		];

// 		const resourceTypes = ["image", "video", "raw"];

// 		for (const variation of variations) {
// 			for (const resourceType of resourceTypes) {
// 				try {
// 					console.log(
// 						`Trying variation: ${variation} with type: ${resourceType}`
// 					);

// 					const result = await cloudinary.uploader.destroy(
// 						variation,
// 						{
// 							resource_type: resourceType,
// 							invalidate: true,
// 						}
// 					);

// 					if (
// 						result &&
// 						(result.result === "ok" ||
// 							result.result === "not found")
// 					) {
// 						console.log(
// 							`Success with variation: ${variation}, type: ${resourceType}`
// 						);
// 						return true;
// 					}
// 				} catch (error) {
// 					// Continue trying other combinations
// 				}
// 			}
// 		}

// 		console.log("Force deletion failed with all strategies");
// 		return false;
// 	} catch (error) {
// 		console.error("Error in force delete:", error);
// 		return false;
// 	}
// };

// module.exports = {
// 	uploadToCloudinary,
// 	cloudinary,
// 	uploadBuffer,
// 	deleteFileFromCloudinary,
// 	forceDeleteCloudinaryFile,
// };

// config/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier"); // npm install streamifier

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Stream a buffer directly to Cloudinary
 * @param {Buffer} buffer - file buffer from multer.memoryStorage()
 * @param {String} folder - Cloudinary folder (optional)
 * @param {String} originalname - original filename (optional)
 * @returns {Promise<String>} secure_url
 */
const uploadBuffer = (buffer, folder = "", originalname = "") =>
	new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: folder || process.env.CLOUDINARY_FOLDER,
				resource_type: "auto",
				use_filename: true,
				unique_filename: true,
				public_id: originalname
					? originalname.split(".")[0]
					: undefined,
			},
			(error, result) => {
				if (error) return reject(error);
				resolve(result.secure_url);
			}
		);
		streamifier.createReadStream(buffer).pipe(stream);
	});

/**
 * Enhanced function to extract public ID from Cloudinary URL
 * @param {string} cloudinaryUrl - The Cloudinary URL
 * @returns {string|null} - The extracted public ID
 */
const extractPublicIdFromUrl = (cloudinaryUrl) => {
	if (!cloudinaryUrl || typeof cloudinaryUrl !== "string") {
		console.log("Invalid URL provided");
		return null;
	}

	try {
		const url = new URL(cloudinaryUrl);
		const pathname = url.pathname;

		const uploadMatch = pathname.match(
			/\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+)$/
		);
		if (uploadMatch) {
			let publicId = uploadMatch[2];
			publicId = publicId.replace(/\.[^/.]+$/, "");
			console.log("Extracted public ID:", publicId);
			return publicId;
		}

		console.log("Could not match upload pattern in URL:", cloudinaryUrl);
		return null;
	} catch (error) {
		console.error("Error extracting public ID:", error);
		return null;
	}
};

/**
 * Enhanced deletion function with better error handling
 * @param {string} fileUrl - The Cloudinary URL
 * @returns {Promise<boolean>} - Success status
 */
const deleteFileFromCloudinary = async (fileUrl) => {
	if (!fileUrl || typeof fileUrl !== "string") {
		console.log("Invalid file URL provided for deletion");
		return false;
	}

	if (!fileUrl.includes("cloudinary.com")) {
		console.log("Not a Cloudinary URL:", fileUrl);
		return false;
	}

	try {
		const publicId = extractPublicIdFromUrl(fileUrl);
		if (!publicId) {
			console.log("Could not extract public ID from URL:", fileUrl);
			return false;
		}

		let resourceType = "auto";
		if (fileUrl.includes("/image/upload/")) {
			resourceType = "image";
		} else if (fileUrl.includes("/video/upload/")) {
			resourceType = "video";
		} else if (fileUrl.includes("/raw/upload/")) {
			resourceType = "raw";
		}

		console.log(
			`Attempting to delete: ${publicId} with resource_type: ${resourceType}`
		);

		try {
			const result = await cloudinary.uploader.destroy(publicId, {
				resource_type: resourceType,
				invalidate: true,
			});

			console.log("Deletion result:", result);

			if (result && result.result === "ok") {
				console.log("Successfully deleted file from Cloudinary");
				return true;
			} else if (result && result.result === "not found") {
				console.log(
					"File was not found in Cloudinary (may have been already deleted)"
				);
				return true;
			}
		} catch (deleteError) {
			console.log(
				`Failed with resource_type ${resourceType}:`,
				deleteError.message
			);
		}

		const resourceTypes = ["image", "video", "raw"];
		for (const type of resourceTypes) {
			if (type === resourceType) continue;

			try {
				console.log(`Trying with resource_type: ${type}`);
				const result = await cloudinary.uploader.destroy(publicId, {
					resource_type: type,
					invalidate: true,
				});

				console.log(`Result with ${type}:`, result);

				if (
					result &&
					(result.result === "ok" ||
						result.result === "not found")
				) {
					console.log(
						`Successfully deleted with resource_type: ${type}`
					);
					return true;
				}
			} catch (error) {
				console.log(
					`Failed with resource_type ${type}:`,
					error.message
				);
			}
		}

		try {
			console.log("Trying Admin API deletion...");
			const adminResult = await cloudinary.api.delete_resources(
				[publicId],
				{
					resource_type: "auto",
					invalidate: true,
				}
			);

			console.log("Admin API result:", adminResult);

			if (
				adminResult &&
				adminResult.deleted &&
				adminResult.deleted[publicId] === "deleted"
			) {
				console.log("Successfully deleted using Admin API");
				return true;
			}
		} catch (adminError) {
			console.log("Admin API deletion failed:", adminError.message);
		}

		console.log("All deletion methods failed");
		return false;
	} catch (error) {
		console.error("Error in deleteFileFromCloudinary:", error);
		return false;
	}
};

/**
 * Force delete with multiple strategies
 * @param {string} fileUrl - The Cloudinary URL
 * @returns {Promise<boolean>} - Success status
 */
const forceDeleteCloudinaryFile = async (fileUrl) => {
	console.log("Force delete attempting to remove:", fileUrl);

	const standardResult = await deleteFileFromCloudinary(fileUrl);
	if (standardResult) {
		console.log("Standard deletion succeeded");
		return true;
	}

	try {
		const publicId = extractPublicIdFromUrl(fileUrl);
		if (!publicId) {
			console.log("Could not extract public ID for force deletion");
			return false;
		}

		const variations = [
			publicId,
			publicId.replace(/^[^/]+\//, ""),
			`${process.env.CLOUDINARY_FOLDER}/${publicId}`,
			publicId.split("/").pop(),
		];

		const resourceTypes = ["image", "video", "raw"];

		for (const variation of variations) {
			for (const resourceType of resourceTypes) {
				try {
					console.log(
						`Trying variation: ${variation} with type: ${resourceType}`
					);

					const result = await cloudinary.uploader.destroy(
						variation,
						{
							resource_type: resourceType,
							invalidate: true,
						}
					);

					if (
						result &&
						(result.result === "ok" ||
							result.result === "not found")
					) {
						console.log(
							`Success with variation: ${variation}, type: ${resourceType}`
						);
						return true;
					}
				} catch (error) {
					// Continue trying other combinations
				}
			}
		}

		console.log("Force deletion failed with all strategies");
		return false;
	} catch (error) {
		console.error("Error in force delete:", error);
		return false;
	}
};

module.exports = {
	uploadBuffer,
	cloudinary,
	deleteFileFromCloudinary,
	forceDeleteCloudinaryFile,
};
