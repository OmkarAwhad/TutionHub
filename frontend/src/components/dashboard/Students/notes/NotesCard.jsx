import React from "react";

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
					{new Date(note.uploadDate).toLocaleDateString()}
				</p>
			</div>
			<div className="pt-4">
				<a
					href={note.file}
					download
					className="py-3 w-full rounded-lg bg-medium-gray text-white font-extralight text-sm hover:bg-charcoal-gray transition-all duration-200 flex items-center justify-center cursor-pointer"
				>
					Download Notes
				</a>
			</div>
		</div>
	);
}

export default NotesCard;
