import React from "react";
import { format } from "date-fns";
import { PiStudentDuotone } from "react-icons/pi";
import { setMarkLecture } from "../../../../slices/attendance.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdGrade } from "react-icons/md";

function PastDateCard({ lecture, mode = "mark", onAttendanceMarked }) {
	const isPastDate = (date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return new Date(date) < today;
	};

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleCardClick = () => {
		if (mode === "mark") {
			dispatch(setMarkLecture(lecture));
			navigate(
				`/dashboard/admin-attendance/mark-attendance/${lecture._id}`,
				// { state: { onAttendanceMarked } }
			);
		} else if (mode == "view") {
			dispatch(setMarkLecture(lecture));
			navigate(
				`/dashboard/admin-attendance/view-attendance/${lecture._id}`
			);
		} else if (mode == "marks") {
			dispatch(setMarkLecture(lecture));
			navigate(`/dashboard/admin-marks/add-marks/${lecture._id}`);
		} else if (mode == "view-marks") {
			dispatch(setMarkLecture(lecture));
			navigate(`/dashboard/admin-marks/view-marks/${lecture._id}`);
		}
	};

	return (
		<>
			{isPastDate(lecture.date) ? (
				<div className="space-y-4 relative p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300 ">
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-xl font-semibold text-richblack-5">
								{lecture.subject?.name}
							</h3>
							<p className="text-medium-gray">
								{format(new Date(lecture.date), "PPP")}
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<p className="text-richblack-200">
							<span className="text-medium-gray">
								Time:
							</span>{" "}
							{lecture.time}
						</p>
						<p className="text-richblack-200">
							<span className="text-medium-gray">
								Tutor:
							</span>{" "}
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
						<button
							onClick={handleCardClick}
							className="py-3 w-full rounded-lg bg-medium-gray text-white font-extralight text-xs hover:bg-charcoal-gray transition-all duration-200 flex gap-2 items-center justify-center cursor-pointer"
						>
							{mode === "mark"
								? "Mark Attendance"
								: mode === "view"
								? "View Attendance"
								: mode === "marks"
								? "Add Marks"
								: mode === "view-marks"
								? "View Marks"
								: null}
							<span className="text-base">
								{mode === "marks" || mode === "view-marks" ? (
									<MdGrade />
								) : (
									<PiStudentDuotone />
								)}
							</span>
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}

export default PastDateCard;
