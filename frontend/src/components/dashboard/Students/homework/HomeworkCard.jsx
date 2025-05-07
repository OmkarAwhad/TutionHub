import React from "react";
import { useNavigate } from "react-router-dom";
import { getFileTypeDescription } from "../../../../utils/fileUtils";
import EnhancedDownloader from "./EnhancedDownloader";

function HomeworkCard({ item }) {
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate("/dashboard/get-homework/view-homework", {
			state: { homework: item },
		});
	};

	return (
		<div className="p-6 rounded-xl text-charcoal-gray shadow-2xl shadow-medium-gray hover:shadow-xl transition-all duration-200 relative">
			<div
				className="absolute right-4 top-4 z-10"
				onClick={(e) => e.stopPropagation()} // Prevent triggering card click
			>
				{item.fileUrl && (
					<EnhancedDownloader
						fileUrl={item.fileUrl}
						title={item.title || "homework"}
						icon={true}
						showProgress={true} // Ensure progress is shown
						className="flex items-center justify-center w-10 h-10 cursor-pointer rounded-full bg-medium-gray text-white hover:bg-charcoal-gray transition-colors duration-200"
					/>
				)}
			</div>

			<div
				className="space-y-2 cursor-pointer"
				onClick={handleCardClick}
			>
				<h3 className="text-xl font-semibold ">{item.title}</h3>
				<p className=" text-medium-gray">
					{item.subject.name} ({item.subject.code})
				</p>
				<p className=" text-charcoal-gray">
					<span className=" text-medium-gray">Tutor:</span>{" "}
					{item.tutor.name}
				</p>
				<p className=" text-charcoal-gray">
					<span className=" text-medium-gray">Due Date:</span>{" "}
					{new Date(item.dueDate).toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
					})}
				</p>
				{item.fileUrl && (
					<p className="text-charcoal-gray">
						<span className="text-medium-gray">File Type:</span>{" "}
						{getFileTypeDescription(item.fileUrl)}
					</p>
				)}
			</div>
		</div>
	);
}

export default HomeworkCard;