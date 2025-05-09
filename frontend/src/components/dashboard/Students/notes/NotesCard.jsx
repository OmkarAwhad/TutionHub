import React from "react";
import { getFileTypeDescription, getDownloadUrl } from "../../../../utils/fileUtils";
import FileDownloadButton from "./FileDownloadButton";

function NotesCard({ note }) {
	return (
		<div className="space-y-4 relative p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300 bg-richblack-800">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-xl font-semibold text-richblack-5">
						{note.title}
					</h3>
					<p className="text-medium-gray">
						{note.subject.name} ({note.subject.code})
					</p>
				</div>
			</div>
			<div className="space-y-2">
				<p className="text-richblack-200">
					<span className="text-medium-gray">Tutor:</span>{" "}
					{note.tutor.name}
				</p>
				<p className="text-richblack-200">
					<span className="text-medium-gray">Uploaded:</span>{" "}
					{new Date(note.uploadDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                     })}
				</p>
				<p className="text-richblack-200">
					<span className="text-medium-gray">File Type:</span>{" "}
					{getFileTypeDescription(note.file)}
				</p>
			</div>
			<div className="pt-4">
				<FileDownloadButton
					fileUrl={getDownloadUrl(note.file)}
					title={note.title}
					buttonText="Download Notes"
					className="py-3 w-full rounded-lg bg-medium-gray text-white font-extralight text-sm hover:bg-charcoal-gray transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
				/>
			</div>
		</div>
	);
}

export default NotesCard;