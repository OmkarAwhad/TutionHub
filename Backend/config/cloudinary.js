// cloudinary.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises; // Updated to use promises for consistency

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder: process.env.CLOUDINARY_FOLDER,
			resource_type: "auto",
		});

		// Delete local file after successful upload
		await fs.unlink(filePath);

		return result.secure_url;
	} catch (error) {
		// Delete local file even if upload fails
		if (
			await fs
				.access(filePath)
				.then(() => true)
				.catch(() => false)
		) {
			await fs.unlink(filePath);
		}
		throw error;
	}
};

// Updated extractPublicIdFromUrl function with better logging and handling
const extractPublicIdFromUrl = (cloudinaryUrl) => {
	if (!cloudinaryUrl) {
		console.log("URL is undefined or null");
		return null;
	}

	console.log("Attempting to extract public ID from URL:", cloudinaryUrl);

	try {
		// Handle both URL object and string formats
		let url;
		try {
			url = new URL(cloudinaryUrl);
		} catch (urlError) {
			console.log("Invalid URL format:", cloudinaryUrl);
			return null;
		}

		// Split the pathname into segments
		const pathSegments = url.pathname.split("/");
		console.log("Path segments:", pathSegments);

		// Find the index of "upload" in the path
		const uploadIndex = pathSegments.findIndex(
			(segment) => segment === "upload"
		);

		// If upload is not found, try to find the folder name from your Cloudinary config
		const folderIndex = pathSegments.findIndex(
			(segment) => segment === process.env.CLOUDINARY_FOLDER
		);

		const startIndexBase =
			uploadIndex !== -1
				? uploadIndex
				: folderIndex !== -1
				? folderIndex
				: -1;

		if (startIndexBase === -1) {
			console.log(
				"Could not find 'upload' or folder segment in URL path:",
				cloudinaryUrl
			);
			// Try a fallback approach - extract everything after the domain
			const domain = url.hostname;
			const path = url.pathname;
			console.log(
				`Fallback approach - Domain: ${domain}, Path: ${path}`
			);

			// Extract folder and file path
			const segments = path.split("/").filter((segment) => segment);
			if (segments.length >= 2) {
				// Skip the first segment if it's "image" or similar
				const startIdx = ["image", "video", "raw"].includes(
					segments[0]
				)
					? 1
					: 0;
				// Join remaining segments
				const publicId = segments
					.slice(startIdx)
					.join("/")
					.replace(/\.[^/.]+$/, "");
				console.log("Fallback extracted public ID:", publicId);
				return publicId;
			}
			return null;
		}

		// Check if the next segment is a version identifier (starts with v and followed by numbers)
		let startIndex = startIndexBase + 1;
		if (
			pathSegments[startIndex] &&
			/^v\d+$/.test(pathSegments[startIndex])
		) {
			startIndex++;
		}

		// Join the remaining segments to form the public ID
		const publicId = pathSegments.slice(startIndex).join("/");

		// Remove file extension if present
		const cleanPublicId = publicId.replace(/\.[^/.]+$/, "");
		console.log("Extracted public ID:", cleanPublicId);

		return cleanPublicId;
	} catch (error) {
		console.error("Error extracting public ID:", error);
		return null;
	}
};

/**
 * Enhanced deleteFileFromCloudinary function with better error handling and debugging
 * @param {string} fileUrl - The Cloudinary URL of the file to delete
 * @returns {Promise<boolean>} - True if deletion was successful, false otherwise
 */
const deleteFileFromCloudinary = async (fileUrl) => {
	if (!fileUrl) {
		console.log("File URL is undefined or null");
		return false;
	}

	if (
		!fileUrl.includes("cloudinary.com") &&
		!fileUrl.includes("res.cloudinary.com")
	) {
		console.log("Not a valid Cloudinary URL:", fileUrl);
		return false;
	}

	try {
		// Extract the public ID from the URL
		const publicId = extractPublicIdFromUrl(fileUrl);

		if (!publicId) {
			console.log("Failed to extract public ID from URL:", fileUrl);
			return false;
		}

		console.log("Attempting to delete file with public ID:", publicId);

		// Try different resource types if we're not sure
		const resourceTypes = ["image", "video", "raw"];
		let deleted = false;

		for (const resourceType of resourceTypes) {
			try {
				console.log(
					`Attempting deletion with resource_type=${resourceType}, publicId=${publicId}`
				);
				const result = await cloudinary.uploader.destroy(publicId, {
					resource_type: resourceType,
					invalidate: true,
				});

				console.log(
					`Deletion result with resource_type=${resourceType}:`,
					result
				);

				if (result && result.result === "ok") {
					console.log(
						`Successfully deleted file with resource_type=${resourceType}`
					);
					deleted = true;
					break;
				}
			} catch (error) {
				console.log(
					`Failed to delete with resource_type=${resourceType}:`,
					error.message
				);
				// Continue trying other resource types
			}
		}

		if (!deleted) {
			console.log(
				"Failed to delete file with all resource types. Trying alternative approach."
			);

			// Try with folder prefix if available
			if (process.env.CLOUDINARY_FOLDER) {
				const folderPrefixedId = `${process.env.CLOUDINARY_FOLDER}/${publicId}`;
				console.log("Trying with folder prefix:", folderPrefixedId);

				for (const resourceType of resourceTypes) {
					try {
						const result = await cloudinary.uploader.destroy(
							folderPrefixedId,
							{
								resource_type: resourceType,
								invalidate: true,
							}
						);

						if (result && result.result === "ok") {
							console.log(
								`Successfully deleted file with folder prefix and resource_type=${resourceType}`
							);
							deleted = true;
							break;
						}
					} catch (error) {
						console.log(
							`Failed with folder prefix and resource_type=${resourceType}:`,
							error.message
						);
					}
				}
			}
		}

		return deleted;
	} catch (error) {
		console.error("Error deleting file from Cloudinary:", error);
		return false;
	}
};
const directDeleteFromCloudinary = async (fileUrl) => {
	if (!fileUrl) {
		console.log("[Direct Delete] File URL is undefined or null");
		return false;
	}

	// console.log("[Direct Delete] Attempting to delete:", fileUrl);

	// First, check if the URL is likely a Cloudinary URL
	if (!fileUrl.includes("cloudinary.com")) {
		console.log("[Direct Delete] Not a Cloudinary URL:", fileUrl);
		return false;
	}

	try {
		// Extract different parts of the URL to try multiple deletion approaches
		const url = new URL(fileUrl);
		const pathParts = url.pathname
			.split("/")
			.filter((part) => part.length > 0);
		console.log("[Direct Delete] Path parts:", pathParts);

		// Common Cloudinary URL formats:
		// 1. https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{extension}
		// 2. https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{public_id}.{extension}
		// 3. https://res.cloudinary.com/{cloud_name}/image/upload/v1234/{folder}/{filename}.{extension}

		// Find indices of important parts
		const resourceTypeIndex = pathParts.findIndex((part) =>
			["image", "video", "raw", "auto"].includes(part)
		);
		const uploadIndex = pathParts.findIndex((part) => part === "upload");

		if (resourceTypeIndex === -1 || uploadIndex === -1) {
			console.log(
				"[Direct Delete] Can't identify resource type or upload in URL"
			);
			return false;
		}

		const resourceType = pathParts[resourceTypeIndex];

		// Check if there's a version (starts with 'v' followed by numbers)
		let startIndex = uploadIndex + 1;
		if (
			startIndex < pathParts.length &&
			/^v\d+$/.test(pathParts[startIndex])
		) {
			startIndex++;
		}

		// The remaining parts form the public_id
		const publicIdParts = pathParts.slice(startIndex);

		// Remove extension from the last part
		const lastPart = publicIdParts[publicIdParts.length - 1];
		const lastDotIndex = lastPart.lastIndexOf(".");
		if (lastDotIndex !== -1) {
			publicIdParts[publicIdParts.length - 1] = lastPart.substring(
				0,
				lastDotIndex
			);
		}

		const publicId = publicIdParts.join("/");
		// console.log("[Direct Delete] Extracted public ID:", publicId);
		// console.log("[Direct Delete] Resource type:", resourceType);

		// Try deleting with the extracted information
		const result = await cloudinary.uploader.destroy(publicId, {
			resource_type: resourceType,
			invalidate: true,
		});

		// console.log("[Direct Delete] Deletion result:", result);

		if (result && result.result === "ok") {
			return true;
		}

		// If that didn't work, try alternate approaches
		const alternativePublicIds = [
			publicId,
			`${process.env.CLOUDINARY_FOLDER}/${publicId}`,
			publicId.split("/").slice(1).join("/"), // Try without first folder
			publicIdParts.join("/").replace(/-/g, "_"), // Replace hyphens with underscores
			publicIdParts.join("/").replace(/_/g, "-"), // Replace underscores with hyphens
		];

		const resourceTypes = ["image", "video", "raw", "auto"];

		// Try each combination of public ID and resource type
		for (const altPublicId of alternativePublicIds) {
			for (const altResourceType of resourceTypes) {
				if (altPublicId && altResourceType) {
					try {
						// console.log(
						// 	`[Direct Delete] Trying with public_id='${altPublicId}', resource_type='${altResourceType}'`
						// );
						const altResult =
							await cloudinary.uploader.destroy(
								altPublicId,
								{
									resource_type: altResourceType,
									invalidate: true,
								}
							);

						// console.log(`[Direct Delete] Result:`, altResult);

						if (altResult && altResult.result === "ok") {
							// console.log(
							// 	`[Direct Delete] Success with public_id='${altPublicId}', resource_type='${altResourceType}'`
							// );
							return true;
						}
					} catch (err) {
						console.log(
							`[Direct Delete] Error with public_id='${altPublicId}', resource_type='${altResourceType}':`,
							err.message
						);
						// Continue trying other combinations
					}
				}
			}
		}

		return false;
	} catch (error) {
		console.error("[Direct Delete] Error:", error);
		return false;
	}
};

// Utility to try multiple deletion techniques
const forceDeleteCloudinaryFile = async (fileUrl) => {
	console.log("Force delete attempting to remove:", fileUrl);

	// If the URL doesn't exist or isn't a string
	if (!fileUrl || typeof fileUrl !== "string") {
		console.log("Invalid URL provided for deletion");
		return false;
	}

	try {
		// Method 1: Try the direct approach first
		const directResult = await directDeleteFromCloudinary(fileUrl);
		if (directResult) {
			console.log("Direct deletion succeeded");
			return true;
		}

		// Method 2: Try admin API deletion if direct fails
		// Extract folder path if present
		let folderPath = "";
		try {
			const url = new URL(fileUrl);
			const pathSegments = url.pathname.split("/");

			// Look for common patterns in Cloudinary URLs
			const uploadIndex = pathSegments.indexOf("upload");
			if (
				uploadIndex !== -1 &&
				uploadIndex + 1 < pathSegments.length
			) {
				// Skip version number if present
				let startIndex = uploadIndex + 1;
				if (/^v\d+$/.test(pathSegments[startIndex])) {
					startIndex++;
				}

				// Get potential folder path
				if (startIndex < pathSegments.length - 1) {
					folderPath = pathSegments
						.slice(startIndex, -1)
						.join("/");
				}
			}
		} catch (e) {
			console.log("Error extracting folder path:", e.message);
		}

		// If we have a folder path, try listing and deleting
		if (folderPath) {
			// console.log(
			// 	"Trying folder-based deletion for path:",
			// 	folderPath
			// );

			// Try to list files in this folder
			try {
				const resourceTypes = ["image", "video", "raw"];

				for (const resourceType of resourceTypes) {
					try {
						const results = await cloudinary.api.resources({
							type: "upload",
							prefix: folderPath,
							resource_type: resourceType,
							max_results: 500,
						});

						// console.log(
						// 	`Found ${results.resources.length} resources in folder with resource_type=${resourceType}`
						// );

						// Find resources that match our URL pattern
						for (const resource of results.resources) {
							if (
								fileUrl.includes(resource.public_id) ||
								resource.url === fileUrl
							) {
								// console.log(
								// 	"Found matching resource:",
								// 	resource.public_id
								// );

								// Try to delete this specific resource
								const deleteResult =
									await cloudinary.uploader.destroy(
										resource.public_id,
										{
											resource_type:
												resourceType,
											invalidate: true,
										}
									);

								if (
									deleteResult &&
									deleteResult.result === "ok"
								) {
									// console.log(
									// 	"Successfully deleted via folder search"
									// );
									return true;
								}
							}
						}
					} catch (err) {
						console.log(
							`Error listing resources with type ${resourceType}:`,
							err.message
						);
					}
				}
			} catch (err) {
				console.log("Error listing resources:", err.message);
			}
		}

		console.log("All deletion methods failed");
		return false;
	} catch (error) {
		console.error("Force delete error:", error);
		return false;
	}
};
module.exports = {
	uploadToCloudinary,
	cloudinary,
	deleteFileFromCloudinary,
	forceDeleteCloudinaryFile,
};
