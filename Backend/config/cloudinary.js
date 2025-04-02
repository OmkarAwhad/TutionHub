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

module.exports = { uploadToCloudinary, cloudinary }; // Export both
