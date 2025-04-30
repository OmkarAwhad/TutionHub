import React from "react";
import { format } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditLecture } from "../../../../slices/lecture.slice";
import { setMarkLecture } from "../../../../slices/attendance.slice";

function LectureCard({ lecture, isPastDate, handleDeleteClick }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<>
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
						<span className="text-medium-gray">
							Description:
						</span>{" "}
						{lecture.description}
					</p>
				</div>

				<div className="flex gap-3 pt-4">
					<div className=" flex justify-start gap-4 w-[100%] ">
						{!isPastDate(lecture.date) ? (
							<>
								<button
									onClick={() => {
										dispatch(
											setEditLecture(lecture)
										);
										navigate(
											"/dashboard/admin-lecture/edit-lecture"
										);
									}}
									className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs hover:bg-charcoal-gray transition-all duration-200 flex gap-2 items-center justify-center "
								>
									Edit{" "}
									<span className="text-sm">
										<MdModeEdit />
									</span>
								</button>
								<button
									onClick={() =>
										handleDeleteClick(lecture)
									}
									className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs hover:bg-charcoal-gray transition-all duration-200 flex gap-2 items-center justify-center "
								>
									Delete{" "}
									<span className="text-sm">
										<RiDeleteBin6Line />
									</span>
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => {
										dispatch(
											setMarkLecture(lecture)
										);
										navigate(
											`/dashboard/admin-attendance/view-attendance/${lecture._id}`
										);
									}}
									className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs text-center hover:bg-charcoal-gray transition-all duration-200"
								>
									View Attendance
								</button>
								<button
									onClick={() =>
										handleDeleteClick(lecture)
									}
									className="py-3 w-[50%] rounded-lg bg-medium-gray text-white font-extralight text-xs hover:bg-charcoal-gray transition-all duration-200 flex gap-2 items-center justify-center "
								>
									Delete{" "}
									<span className="text-sm">
										<RiDeleteBin6Line />
									</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default LectureCard;
