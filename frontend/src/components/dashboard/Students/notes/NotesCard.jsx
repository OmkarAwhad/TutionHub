import React from "react";
import { getFileTypeDescription, getDownloadUrl } from "../../../../utils/fileUtils";
import FileDownloadButton from "./FileDownloadButton";
import { FaBook, FaUser, FaFile } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

function NotesCard({ note }) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray">
			{/* Header */}
			<div className="mb-4">
				<h3 className="text-lg font-semibold text-charcoal-gray mb-2 line-clamp-2">
					{note.title}
				</h3>
				<div className="flex items-center gap-2 text-medium-gray">
					<FaBook className="text-sm" />
					<span className="text-sm">
						{note.subject.name} ({note.subject.code})
					</span>
				</div>
			</div>

			{/* Info Section */}
			<div className="space-y-3 mb-4">
				{/* Tutor */}
				<div className="flex items-center gap-3 p-3 shadow rounded-lg">
					<FaUser className="text-charcoal-gray" />
					<div>
						<p className="text-xs text-slate-gray">Tutor</p>
						<p className="text-sm font-medium text-charcoal-gray">
							{note.tutor.name}
						</p>
					</div>
				</div>

				{/* Upload Date */}
				<div className="flex items-center gap-3 p-3 shadow rounded-lg">
					<FaCalendarAlt className="text-medium-gray" />
					<div>
						<p className="text-xs text-slate-gray">Uploaded</p>
						<p className="text-sm font-medium text-charcoal-gray">
							{new Date(note.uploadDate).toLocaleDateString("en-GB", {
								day: "2-digit",
								month: "short",
								year: "numeric",
							})}
						</p>
					</div>
				</div>

				{/* File Type */}
				<div className="flex items-center gap-3 p-3 shadow rounded-lg">
					<FaFile className="text-medium-gray" />
					<div>
						<p className="text-xs text-slate-gray">File Type</p>
						<p className="text-sm font-medium text-charcoal-gray">
							{getFileTypeDescription(note.file)}
						</p>
					</div>
				</div>
			</div>

			{/* Download Button */}
			<FileDownloadButton
				fileUrl={getDownloadUrl(note.file)}
				title={note.title}
				buttonText="Download Notes"
				className="w-full flex items-center justify-center gap-4 cursor-pointer py-2 px-4 bg-medium-gray text-white font-medium rounded-lg hover:bg-slate-gray transition-colors duration-200"
			/>
		</div>
	);
}

export default NotesCard;
