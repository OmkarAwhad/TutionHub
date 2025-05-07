/**
 * Utility functions for handling file operations, especially with Cloudinary URLs
 */

/**
 * Extracts file extension from a URL
 * @param {string} url - The file URL
 * @returns {string} - The file extension or default "file"
 */
export const getFileExtension = (url) => {
	if (!url) return "file";
	const extensionMatch = url.match(/\.([^./]+)(?:\?.*)?$/);
	return extensionMatch ? extensionMatch[1].toLowerCase() : "file";
};

/**
 * Generates a file name for download based on title and URL
 * @param {string} title - The title to use for the filename
 * @param {string} url - The file URL to extract extension from
 * @returns {string} - A formatted filename with extension
 */
export const getDownloadFileName = (title, url) => {
	const extension = getFileExtension(url);
	return `${
		title?.replace(/\s+/g, "_").replace(/[^\w-]/g, "") || "file"
	}.${extension}`;
};

/**
 * Modifies a URL to include download attachment flag for Cloudinary URLs
 * @param {string} url - The original URL
 * @returns {string} - Modified URL with fl_attachment flag or original URL
 */
export const getDownloadUrl = (url) => {
	if (!url) return null;
	try {
		// Check if it's a Cloudinary URL
		if (url.includes("cloudinary.com")) {
			// First check if fl_attachment is already in the URL
			if (url.includes("fl_attachment")) {
				return url; // Don't add it again
			}
			
			const urlParts = url.split("/upload/");
			if (urlParts.length === 2) {
				// Add fl_attachment only if it's not already there
				return `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;
			}
		}
		// Return the original URL for non-Cloudinary files
		return url;
	} catch (error) {
		console.error("Error processing download URL:", error);
		return url; // Fallback to original URL
	}
};

/**
 * Initiates download of a file from Cloudinary
 * @param {string} url - The file URL
 * @param {string} fileName - The suggested filename for the download
 * @returns {boolean} - Whether the download was initiated successfully
 */
export const downloadFile = (url, fileName) => {
	if (!url) {
		console.error("No URL provided for download");
		return false;
	}

	try {
		const downloadUrl = getDownloadUrl(url);

		// Create temporary anchor element to trigger download
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = fileName || getDownloadFileName("file", url);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		return true;
	} catch (error) {
		console.error("Download error:", error);
		return false;
	}
};

/**
 * Maps MIME types to more user-friendly descriptions
 * @param {string} url - The file URL to analyze
 * @returns {string} - A user-friendly file type description
 */
export const getFileTypeDescription = (url) => {
	const extension = getFileExtension(url);

	const typeMap = {
		pdf: "PDF Document",
		doc: "Word Document",
		docx: "Word Document",
		xls: "Excel Spreadsheet",
		xlsx: "Excel Spreadsheet",
		ppt: "PowerPoint Presentation",
		pptx: "PowerPoint Presentation",
		jpg: "Image",
		jpeg: "Image",
		png: "Image",
		gif: "Image",
		txt: "Text Document",
		csv: "CSV Spreadsheet",
		zip: "ZIP Archive",
		rar: "RAR Archive",
		mp3: "Audio File",
		mp4: "Video File",
		mov: "Video File",
	};

	return typeMap[extension] || `${extension.toUpperCase()} File`;
};

/**
 * Gets appropriate icon based on file type
 * @param {string} url - The file URL
 * @returns {string} - Icon name for the file type
 */
export const getFileTypeIcon = (url) => {
	const extension = getFileExtension(url);

	// Map extensions to icon types
	const iconMap = {
		// Documents
		pdf: "file-pdf",
		doc: "file-word",
		docx: "file-word",
		txt: "file-text",

		// Spreadsheets
		xls: "file-excel",
		xlsx: "file-excel",
		csv: "file-csv",

		// Presentations
		ppt: "file-powerpoint",
		pptx: "file-powerpoint",

		// Images
		jpg: "file-image",
		jpeg: "file-image",
		png: "file-image",
		gif: "file-image",
		svg: "file-image",

		// Archives
		zip: "file-archive",
		rar: "file-archive",
		tar: "file-archive",
		gz: "file-archive",

		// Media
		mp3: "file-audio",
		wav: "file-audio",
		mp4: "file-video",
		mov: "file-video",
		avi: "file-video",

		// Code
		html: "file-code",
		css: "file-code",
		js: "file-code",
		json: "file-code",
		xml: "file-code",
		py: "file-code",
		java: "file-code",
	};

	return iconMap[extension] || "file";
};

/**
 * Check if a URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
	if (!url) return false;
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
};

/**
 * Check if file is an image based on URL
 * @param {string} url - File URL to check
 * @returns {boolean} - Whether the file is likely an image
 */
export const isImageFile = (url) => {
	if (!url) return false;
	const ext = getFileExtension(url);
	return ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext);
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size with units
 */
export const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	if (!bytes || isNaN(bytes)) return "Unknown size";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};