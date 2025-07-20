import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import { viewStudAttendanceForLec } from "../../../../services/operations/attendance.service";
import { FaArrowLeftLong, FaUser, FaClock, FaBook } from "react-icons/fa6";
import { FaChalkboardTeacher, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { clearmarkLecture } from "../../../../slices/attendance.slice";
import { FiFileText } from "react-icons/fi";
// import { FaArrowLeftLong, FaUser, FaClock, FaBook, FaEdit } from "react-icons/fa6";

function ViewingLecAttendance() {
	const { lectureId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);
	const { markLecture } = useSelector((state) => state.attendance);
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
	}, [lectureId, dispatch, token]);

	// Cleanup function to clear the lecture data when component unmounts
	useEffect(() => {
		return () => {
			dispatch(clearmarkLecture());
		};
	}, []);

	// Helper function to safely format date
	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		const date = new Date(dateString);
		return isValid(date) ? format(date, "dd MMM yyyy") : "Invalid Date";
	};

	// Show loading state
	if (loading && !markLecture) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	// Calculate attendance stats
	const presentCount = attendanceList.filter(
		(att) => att.status === "Present"
	).length;
	const absentCount = attendanceList.filter(
		(att) => att.status === "Absent"
	).length;
	const totalStudents = attendanceList.length;

	return (
		<div className="p-6">
			{/* Header */}
			{/* Header */}
<div className="flex items-center justify-between mb-8">
   <div className="flex items-center gap-3">
      <FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
      <h1 className="text-3xl font-bold text-charcoal-gray">
         Attendance Details
      </h1>
   </div>
   
   <div className="flex items-center gap-3">
      {/* Edit Button */}
      <button
         onClick={() => navigate(`/dashboard/admin-attendance/edit-attendance/${lectureId}`)}
         className="flex items-center gap-2 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
      >
         <FaEdit className="text-sm" />
         <span>Edit Attendance</span>
      </button>
      
      {/* Back Button */}
      <button
         onClick={() => navigate("/dashboard/admin-attendance/view-attendance")}
         className="flex cursor-pointer items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
      >
         <FaArrowLeftLong className="text-sm" />
         <span>Back</span>
      </button>
   </div>
</div>


			{/* Lecture Details */}
			{markLecture && (
				<div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
					<h2 className="text-xl font-semibold text-charcoal-gray mb-4">
						Lecture Information
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Subject */}
						<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
							<FaBook className="text-charcoal-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Subject
								</p>
								<p className="text-sm font-semibold text-charcoal-gray">
									{markLecture.subject?.name ||
										"N/A"}
								</p>
							</div>
						</div>

						{/* Date */}
						<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
							<FaCalendarAlt className="text-medium-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Date
								</p>
								<p className="text-sm font-semibold text-charcoal-gray">
									{formatDate(markLecture.date)}
								</p>
							</div>
						</div>

						{/* Time */}
						<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
							<FaClock className="text-medium-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Time
								</p>
								<p className="text-sm font-semibold text-charcoal-gray">
									{markLecture.time || "N/A"}
								</p>
							</div>
						</div>

						{/* Tutor */}
						<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
							<FaUser className="text-charcoal-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Tutor
								</p>
								<p className="text-sm font-semibold text-charcoal-gray">
									{markLecture.tutor?.name || "N/A"}
								</p>
							</div>
						</div>
					</div>

					{/* Description */}
					{markLecture.description && (
						<div className="flex items-center gap-3 mt-4 p-3 bg-light-gray rounded-lg">
							<FiFileText className="text-charcoal-gray" />
							<div>
								<p className="text-xs text-slate-gray mb-1">
									Description
								</p>
								<p className="text-sm font-medium text-charcoal-gray">
									{markLecture.description}
								</p>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Attendance Stats */}
			<div className="grid grid-cols-3 gap-4 mb-6">
				<div className="bg-light-gray p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">
						Total Students
					</p>
					<p className="text-lg font-bold text-charcoal-gray">
						{totalStudents}
					</p>
				</div>
				<div className="bg-light-gray p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">Present</p>
					<p className="text-lg font-bold text-charcoal-gray">
						{presentCount}
					</p>
				</div>
				<div className="bg-light-gray p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">Absent</p>
					<p className="text-lg font-bold text-medium-gray">
						{absentCount}
					</p>
				</div>
			</div>

			{/* Attendance Table */}
			{attendanceList.length > 0 ? (
				<div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
					{/* <div className="p-4 border-b border-light-gray">
						<h3 className="text-lg font-semibold text-charcoal-gray">
							Student Attendance List
						</h3>
					</div> */}

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-light-gray">
								<tr>
									<th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-gray">
										Student Name
									</th>
									<th className="px-6 py-3 text-center text-sm font-semibold text-charcoal-gray">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-light-gray">
								{attendanceList.map((attendance) => (
									<tr
										key={attendance._id}
										className="hover:bg-light-gray/30"
									>
										<td className="px-6 py-4 text-sm font-medium text-charcoal-gray">
											{attendance.student
												?.name ||
												"Unknown Student"}
										</td>
										<td className="px-6 py-4 text-center">
											<span
												className={`px-3 py-1 text-xs font-semibold rounded-full ${
													attendance.status ===
													"Present"
														? "bg-charcoal-gray text-white"
														: "border border-charcoal-gray text-charcoal-gray"
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
			) : (
				<div className="text-center py-12">
					<FaChalkboardTeacher className="mx-auto h-16 w-16 text-slate-gray mb-4" />
					<p className="text-medium-gray text-xl">
						No attendance records found
					</p>
				</div>
			)}
		</div>
	);
}

export default ViewingLecAttendance;
