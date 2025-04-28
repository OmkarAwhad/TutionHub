import React from "react";
import { format } from "date-fns";
import { PiStudentDuotone } from "react-icons/pi";
import { setMarkAttendanceLecture } from "../../../../slices/attendance.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function AttendanceCard({ lecture }) {
	const isPastDate = (date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return new Date(date) < today;
	};

	const dispatch = useDispatch();
	const navigate = useNavigate();

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
							onClick={() => {
								dispatch(
									setMarkAttendanceLecture(lecture)
								);
								navigate(
									`/dashboard/admin-attendance/mark-attendance/${lecture._id}`
								);
							}}
							className="py-3 w-full rounded-lg bg-medium-gray text-white font-extralight text-xs hover:bg-charcoal-gray transition-all duration-200 flex gap-2 items-center justify-center cursor-pointer "
						>
							Mark Attendance
							<span className="text-base">
								<PiStudentDuotone />
							</span>
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}

export default AttendanceCard;
