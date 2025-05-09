import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import { getDownloadUrl } from "../../../../utils/fileUtils";

function TutorHomeworkCard({ homework, handleDeleteClick }) {
	return (
		<div className="space-y-4 relative p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300 bg-richblack-800">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-xl font-semibold text-richblack-5">
						{homework.title}
					</h3>
					<p className="text-medium-gray">
						{homework.subject.name} ({homework.subject.code})
					</p>
				</div>
			</div>
			<div
				onClick={() => handleDeleteClick(homework)}
				className="absolute top-15 right-6 bg-medium-gray text-white cursor-pointer hover:bg-charcoal-gray border-2 hover:border-red-200 hover:text-red-200 p-3 rounded-full text-lg transition-all duration-150"
			>
				<RiDeleteBinLine />
			</div>
			<div className="space-y-2">
				<p className="text-richblack-200">
					<span className="text-medium-gray">Tutor:</span>{" "}
					{homework.tutor.name}
				</p>
				<p className="text-richblack-200">
					<span className="text-medium-gray">Uploaded:</span>{" "}
					{new Date(homework.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                     })}
				</p>
				<p className="text-richblack-200">
					<span className="text-medium-gray">Due Date:</span>{" "}
					{new Date(homework.dueDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                     })}
				</p>
				{homework.description && (
					<p className="text-richblack-200">
						<span className="text-medium-gray">
							Description:
						</span>{" "}
						{homework.description}
					</p>
				)}
			</div>
			{homework.fileUrl && (
				<div className="pt-4 flex justify-end relative group">
					<span className="text-xs bg-gray-200 px-2 py-1 rounded-md absolute bottom-14 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-[-20px] -right-5 z-10 transition-all duration-300">
						Download File
					</span>
					<a
						href={getDownloadUrl(homework.fileUrl)}
						download
						className="bg-medium-gray text-white cursor-pointer hover:bg-charcoal-gray border-2  p-3 rounded-full text-lg transition-all duration-150 absolute bottom-8"
						title={`Download ${homework.title}`}
					>
						<FaDownload />
					</a>
				</div>
			)}
		</div>
	);
}

export default TutorHomeworkCard;
