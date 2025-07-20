import React from "react";
import { format } from "date-fns";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
	FaEye,
	FaClock,
	FaUser,
	FaGraduationCap,
	FaClipboardList,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditLecture } from "../../../../slices/lecture.slice";
import { setMarkLecture } from "../../../../slices/attendance.slice";

function LectureCard({ lecture, isPastDate, handleDeleteClick }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<>
			<div className="space-y-4 relative">
				{/* Header */}
				<div className="flex justify-between items-start">
					<div>
						<h3 className="text-xl font-semibold text-charcoal-gray">
							{lecture.subject?.name}
						</h3>
						<p className="text-medium-gray font-medium">
							{format(new Date(lecture.date), "PPP")}
						</p>
					</div>
					<span
						className={`px-3 py-1 shadow rounded-full text-sm font-medium ${
							isPastDate(lecture.date)
								? "bg-slate-gray text-white"
								: "bg-charcoal-gray/20 text-charcoal-gray"
						}`}
					>
						{isPastDate(lecture.date) ? "Past" : "Upcoming"}
					</span>
				</div>

				{/* Info Section */}
				<div className="space-y-3">
					<div className="flex items-center gap-3 text-sm">
						<FaClock className="text-medium-gray" />
						<span className="text-charcoal-gray font-medium">
							{lecture.time}
						</span>
					</div>

					<div className="flex items-center gap-3 text-sm">
						<FaUser className="text-medium-gray" />
						<span className="text-charcoal-gray font-medium">
							{lecture.tutor?.name}
						</span>
					</div>

					<div className="flex items-center gap-3 text-sm">
						<FaGraduationCap className="text-medium-gray" />
						<span className="text-charcoal-gray font-medium">
							{lecture.standard?.standardName}
						</span>
					</div>

					<div className="flex items-start gap-3 text-sm">
						<FaClipboardList className="text-medium-gray mt-0.5" />
						<span className="text-charcoal-gray font-medium">
							{lecture.description}
						</span>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 pt-4 border-t border-light-gray">
					{!isPastDate(lecture.date) ? (
						<>
							<button
								onClick={() => {
									dispatch(setEditLecture(lecture));
									navigate(
										"/dashboard/admin-lecture/edit-lecture"
									);
								}}
								className="flex-1 py-2.5 rounded-lg bg-charcoal-gray text-white text-sm font-medium hover:bg-medium-gray transition-all duration-200 flex gap-2 items-center justify-center"
							>
								<MdModeEdit />
								Edit
							</button>
							<button
								onClick={() =>
									handleDeleteClick(lecture)
								}
								className="flex-1 py-2.5 rounded-lg bg-light-gray text-slate-gray text-sm font-medium hover:bg-charcoal-gray hover:text-white transition-all duration-200 flex gap-2 items-center justify-center"
							>
								<RiDeleteBin6Line />
								Delete
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => {
									dispatch(setMarkLecture(lecture));
									navigate(
										`/dashboard/admin-attendance/view-attendance/${lecture._id}`
									);
								}}
								className="flex-1 py-2.5 rounded-lg bg-charcoal-gray text-white text-sm font-medium hover:bg-medium-gray transition-all duration-200 flex gap-2 items-center justify-center"
							>
								<FaEye />
								View Attendance
							</button>
							<button
								onClick={() =>
									handleDeleteClick(lecture)
								}
								className="flex-1 group py-2.5 rounded-lg bg-light-gray text-slate-gray text-sm font-medium hover:bg-charcoal-gray hover:text-white transition-all duration-200 flex gap-2 items-center justify-center"
							>
								<RiDeleteBin6Line className="group-hover:text-white" />
								<p className="group-hover:text-white">
									Delete
								</p>
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default LectureCard;
