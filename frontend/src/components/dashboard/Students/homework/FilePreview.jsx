import React, { useState, useEffect } from "react";
import {
	getFileExtension,
	isImageFile,
	getFileTypeDescription,
} from "../../../../utils/fileUtils";
import { Document, Page, pdfjs } from "react-pdf";
import {
	MdPictureAsPdf,
	MdInsertDriveFile,
	MdOutlineFilePresent,
	MdImage,
	MdPlayCircle,
	MdErrorOutline,
} from "react-icons/md";
import { FaFileWord, FaFileExcel, FaFilePowerpoint } from "react-icons/fa";

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Component to preview various file types
 *
 * @param {Object} props
 * @param {string} props.fileUrl - URL of the file to preview
 * @param {string} props.fileName - Optional file name
 * @param {string} props.className - Additional CSS classes
 */
function FilePreview({ fileUrl, fileName, className = "" }) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Reset state when fileUrl changes
		setLoading(true);
		setError(null);
		setPageNumber(1);
	}, [fileUrl]);

	const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
		setLoading(false);
	};

	const onDocumentLoadError = (error) => {
		console.error("Error loading document:", error);
		setError("Failed to load document");
		setLoading(false);
	};

	const extension = getFileExtension(fileUrl);

	// Determine the type of preview to render
	const renderPreview = () => {
		if (!fileUrl) {
			return (
				<div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
					<MdOutlineFilePresent className="text-5xl text-gray-400 mb-2" />
					<p className="text-gray-500">No file to preview</p>
				</div>
			);
		}

		if (error) {
			return (
				<div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
					<MdErrorOutline className="text-5xl text-red-400 mb-2" />
					<p className="text-red-500">{error}</p>
				</div>
			);
		}

		// PDF preview
		if (extension === "pdf") {
			return (
				<div className="flex flex-col w-full">
					<div className="w-full bg-gray-800 text-white p-2 flex justify-between items-center rounded-t-lg">
						<span>{fileName || "PDF Document"}</span>
						<div className="flex items-center gap-2">
							<button
								onClick={() =>
									setPageNumber((prev) =>
										Math.max(prev - 1, 1)
									)
								}
								disabled={pageNumber <= 1}
								className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
							>
								Previous
							</button>
							<span>
								{pageNumber} / {numPages || "?"}
							</span>
							<button
								onClick={() =>
									setPageNumber((prev) =>
										Math.min(
											prev + 1,
											numPages || 1
										)
									)
								}
								disabled={pageNumber >= (numPages || 1)}
								className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
							>
								Next
							</button>
						</div>
					</div>

					<div className="border border-gray-300 p-4 flex justify-center bg-gray-100 rounded-b-lg min-h-[300px]">
						{loading && (
							<div className="flex items-center justify-center h-64">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
							</div>
						)}

						<Document
							file={fileUrl}
							onLoadSuccess={onDocumentLoadSuccess}
							onLoadError={onDocumentLoadError}
							loading={
								<div className="flex items-center justify-center h-64">
									<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
								</div>
							}
						>
							<Page
								pageNumber={pageNumber}
								renderTextLayer={false}
								renderAnnotationLayer={false}
								width={450}
							/>
						</Document>
					</div>
				</div>
			);
		}

		// Image preview
		else if (isImageFile(fileUrl)) {
			return (
				<div className="flex flex-col w-full">
					<div className="w-full bg-gray-800 text-white p-2 rounded-t-lg">
						<span>{fileName || "Image"}</span>
					</div>
					<div className="border border-gray-300 p-4 flex justify-center bg-gray-100 rounded-b-lg">
						<img
							src={fileUrl}
							alt={fileName || "Preview"}
							className="max-w-full max-h-[400px] object-contain"
							onLoad={() => setLoading(false)}
							onError={() => {
								setError("Failed to load image");
								setLoading(false);
							}}
						/>
						{loading && (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
							</div>
						)}
					</div>
				</div>
			);
		}

		// Audio preview
		else if (["mp3", "wav", "ogg"].includes(extension)) {
			return (
				<div className="flex flex-col w-full">
					<div className="w-full bg-gray-800 text-white p-2 rounded-t-lg">
						<span>{fileName || "Audio File"}</span>
					</div>
					<div className="border border-gray-300 p-4 flex flex-col items-center justify-center bg-gray-100 rounded-b-lg">
						<MdPlayCircle className="text-5xl text-medium-gray mb-4" />
						<audio
							controls
							className="w-full max-w-md"
							onLoadedData={() => setLoading(false)}
							onError={() => {
								setError("Failed to load audio file");
								setLoading(false);
							}}
						>
							<source
								src={fileUrl}
								type={`audio/${extension}`}
							/>
							Your browser does not support the audio
							element.
						</audio>
					</div>
				</div>
			);
		}

		// Video preview
		else if (["mp4", "webm", "ogg"].includes(extension)) {
			return (
				<div className="flex flex-col w-full">
					<div className="w-full bg-gray-800 text-white p-2 rounded-t-lg">
						<span>{fileName || "Video File"}</span>
					</div>
					<div className="border border-gray-300 p-4 flex justify-center bg-gray-100 rounded-b-lg">
						<video
							controls
							className="max-w-full max-h-[400px]"
							onLoadedData={() => setLoading(false)}
							onError={() => {
								setError("Failed to load video file");
								setLoading(false);
							}}
						>
							<source
								src={fileUrl}
								type={`video/${extension}`}
							/>
							Your browser does not support the video
							element.
						</video>
					</div>
				</div>
			);
		}

		// Generic file preview (icon-based)
		else {
			let FileIcon = MdInsertDriveFile; // Default file icon
			let iconColor = "text-gray-500";

			// Choose appropriate icon based on file type
			switch (extension) {
				case "doc":
				case "docx":
					FileIcon = FaFileWord;
					iconColor = "text-blue-700";
					break;
				case "xls":
				case "xlsx":
				case "csv":
					FileIcon = FaFileExcel;
					iconColor = "text-green-700";
					break;
				case "ppt":
				case "pptx":
					FileIcon = FaFilePowerpoint;
					iconColor = "text-red-700";
					break;
				default:
					FileIcon = MdInsertDriveFile;
			}

			return (
				<div className="flex flex-col w-full">
					<div className="w-full bg-gray-800 text-white p-2 rounded-t-lg">
						<span>
							{fileName ||
								`${extension.toUpperCase()} File`}
						</span>
					</div>
					<div className="border border-gray-300 p-8 flex flex-col items-center justify-center bg-gray-100 rounded-b-lg">
						<FileIcon
							className={`text-6xl ${iconColor} mb-4`}
						/>
						<p className="text-lg font-medium">
							{fileName || "File"}
						</p>
						<p className="text-sm text-gray-500">
							{getFileTypeDescription(fileUrl)}
						</p>
						<p className="mt-4 text-sm">
							Preview not available for this file type
						</p>
					</div>
				</div>
			);
		}
	};

	return (
		<div className={`file-preview ${className}`}>{renderPreview()}</div>
	);
}

export default FilePreview;
