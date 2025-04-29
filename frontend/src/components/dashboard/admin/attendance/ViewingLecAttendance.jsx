import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import { viewStudAttendanceForLec } from "../../../../services/operations/attendance.service";
import { IoArrowBack } from "react-icons/io5";
import { clearMarkAttendanceLecture } from "../../../../slices/attendance.slice";

function ViewingLecAttendance() {
	const { lectureId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);
	const { markAttendanceLecture } = useSelector((state) => state.attendance);
	const [attendanceList, setAttendanceList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAttendance = async () => {
			try {
				setLoading(true);
				const response = await dispatch(
					viewStudAttendanceForLec(lectureId, token)
				);
				if (response) {
					setAttendanceList(response);
				}
			} catch (error) {
				console.error("Error fetching attendance:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAttendance();

		// Cleanup function to clear the lecture details when component unmounts
		return () => {
			dispatch(clearMarkAttendanceLecture());
		};
	}, [lectureId, dispatch, token]);

	// Helper function to safely format date
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return isValid(date) ? format(date, "PPP") : "Invalid Date";
	};

	// Show loading state only when both loading is true and we don't have lecture data
	if (loading && !markAttendanceLecture) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-richblack-5">Loading...</div>
			</div>
		);
	}

	// If we have lecture data but no attendance list, show a message
	if (!loading && attendanceList.length === 0) {
		return (
			<div className="flex flex-col h-screen">
				<div className="p-8 bg-richblack-900">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl font-bold text-richblack-5">
							Attendance Details
						</h1>
						<button
							onClick={() =>
								navigate(
									"/dashboard/admin-attendance/view-attendance"
								)
							}
							className="flex items-center gap-2 text-richblack-200 cursor-pointer hover:text-richblack-5 transition-all duration-200"
						>
							<IoArrowBack className="text-lg" />
							Back
						</button>
					</div>
					<div className="bg-richblack-800 p-6 rounded-xl shadow-lg">
						<h2 className="text-2xl font-semibold text-richblack-5 mb-4">
							No attendance records found for this lecture
						</h2>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen">
			{/* Fixed Header */}
			<div className="p-8 bg-richblack-900">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-richblack-5">
						Attendance Details
					</h1>
					<button
						onClick={() =>
							navigate(
								"/dashboard/admin-attendance/view-attendance"
							)
						}
						className="flex items-center gap-2 text-richblack-200 cursor-pointer hover:text-richblack-5 transition-all duration-200"
					>
						<IoArrowBack className="text-lg" />
						Back
					</button>
				</div>

				<div className="bg-richblack-800 p-6 rounded-xl shadow-lg">
					{/* <h2 className="text-2xl font-semibold text-richblack-5 mb-4">
						{markAttendanceLecture.subject?.name}
					</h2> */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-medium-gray">Date</p>
							<p className="text-richblack-5">
								{formatDate(markAttendanceLecture?.date)}
							</p>
						</div>
						<div>
							<p className="text-medium-gray">Time</p>
							<p className="text-richblack-5">
								{markAttendanceLecture?.time || "N/A"}
							</p>
						</div>
						<div>
							<p className="text-medium-gray">Tutor</p>
							<p className="text-richblack-5">
								{markAttendanceLecture?.tutor?.name ||
									"N/A"}
							</p>
						</div>
						<div>
							<p className="text-medium-gray">
								Description
							</p>
							<p className="text-richblack-5">
								{markAttendanceLecture?.description ||
									"N/A"}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Scrollable Table Container */}
			<div className="flex-1 overflow-auto p-8 shadow-2xl pt-8">
				<div className="bg-richblack-800 rounded-xl overflow-hidden">
					<table className="w-full">
						<thead className="sticky top-0 bg-richblack-700">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-richblack-200 uppercase tracking-wider">
									Student Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-richblack-200 uppercase tracking-wider">
									Attendance
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-richblack-700">
							{attendanceList.map((attendance) => (
								<tr key={attendance._id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-richblack-5">
										{attendance.student?.name ||
											"Unknown Student"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												attendance.status ===
												"Present"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{attendance.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default ViewingLecAttendance;
