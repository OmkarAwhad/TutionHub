import React from "react";
import { format } from "date-fns";

function LectureCard({lecture,isPastDate,handleDeleteClick}) {
	return (
		<div className="space-y-4 relative ">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="text-xl font-semibold text-richblack-5">
						{lecture.subject?.name}
					</h3>
					<p className="text-medium-gray">
						{format(new Date(lecture.date), "PPP")}
					</p>
				</div>
				<span
					className={`px-3 py-1 rounded-full text-sm font-medium ${
						isPastDate(lecture.date)
							? "bg-yellow-500/10 text-yellow-500"
							: "bg-green-500/10 text-green-500"
					}`}
				>
					{isPastDate(lecture.date) ? "Past" : "Upcoming"}
				</span>
			</div>

			<div className="space-y-2">
				<p className="text-richblack-200">
					<span className="text-medium-gray">Time:</span>{" "}
					{lecture.time}
				</p>
				<p className="text-richblack-200">
					<span className="text-medium-gray">Tutor:</span>{" "}
					{lecture.tutor?.name}
				</p>
				<p className="text-richblack-200">
					<span className="text-medium-gray">Description:</span>{" "}
					{lecture.description}
				</p>
			</div>

			<div className="flex gap-3 pt-4">
				<div className=" flex justify-start gap-4 w-[100%] ">
					{!isPastDate(lecture.date) ? (
						<>
							<button className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs text-center hover:bg-charcoal-gray transition-all duration-200">
								Edit
							</button>
							<button
								onClick={() =>
									handleDeleteClick(lecture)
								}
								className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs text-center hover:bg-charcoal-gray transition-all duration-200"
							>
								Delete Lecture
							</button>
						</>
					) : (
						<>
							<button className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs text-center hover:bg-charcoal-gray transition-all duration-200">
								Mark Attendance
							</button>
							<button
								onClick={() =>
									handleDeleteClick(lecture)
								}
								className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs text-center hover:bg-charcoal-gray transition-all duration-200"
							>
								Delete Lecture
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default LectureCard;
