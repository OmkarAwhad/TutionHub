import React, { useState } from "react";
import { MdDownload, MdError } from "react-icons/md";
import { getDownloadFileName, downloadFile } from "../../../../utils/fileUtils";

/**
 * Reusable file download button component
 * @param {Object} props
 * @param {string} props.fileUrl - URL of the file to download
 * @param {string} props.title - Title to use for the filename
 * @param {string} props.buttonText - Text to display on the button
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.icon - Whether to show download icon
 * @param {Function} props.onDownloadStart - Callback before download starts
 * @param {Function} props.onDownloadComplete - Callback after download initiated
 */
function FileDownloadButton({
	fileUrl,
	title = "file",
	buttonText = "Download File",
	className = "",
	icon = true,
	onDownloadStart,
	onDownloadComplete,
}) {
	const [hasError, setHasError] = useState(false);

	const handleClick = (e) => {
		e.preventDefault();

		if (!fileUrl) {
			console.error("No file URL provided for download");
			setHasError(true);
			setTimeout(() => setHasError(false), 3000); // Reset error state after 3 seconds
			return;
		}

		if (onDownloadStart) onDownloadStart();

		const fileName = getDownloadFileName(title, fileUrl);
		const success = downloadFile(fileUrl, fileName);

		if (!success) {
			setHasError(true);
			setTimeout(() => setHasError(false), 3000);
		} else if (onDownloadComplete) {
			onDownloadComplete();
		}
	};

	const defaultClasses =
		"py-3 px-4 rounded-lg text-white font-extralight text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";
	const errorClasses = "bg-red-600 hover:bg-red-700";
	const normalClasses = "bg-medium-gray hover:bg-charcoal-gray";

	return (
		<button
			onClick={handleClick}
			className={`${className || defaultClasses} ${
				hasError ? errorClasses : normalClasses
			}`}
			disabled={!fileUrl}
		>
			{icon && (hasError ? <MdError className="text-lg" /> : <MdDownload className="text-lg" />)}
			{hasError ? "Error" : buttonText}
		</button>
	);
}

export default FileDownloadButton;
