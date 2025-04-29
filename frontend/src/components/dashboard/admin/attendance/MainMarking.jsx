import React, { useEffect, useState } from "react";
import { getMyStudentsListByLec } from "../../../../services/operations/users.service";
import { markAttendance } from "../../../../services/operations/attendance.service";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { clearMarkAttendanceLecture } from "../../../../slices/attendance.slice";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";

function MainMarking() {
	const { token } = useSelector((state) => state.auth);
	const { markAttendanceLecture } = useSelector((state) => state.attendance);
	const { lectureId } = useParams();
	const [studentsList, setStudentsList] = useState([]);
	const [selectAll, setSelectAll] = useState(true);
	const [attendanceStatus, setAttendanceStatus] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getStudentsList = async () => {
		try {
			const response = await dispatch(
				getMyStudentsListByLec(lectureId, token)
			);
			if (response) {
				setStudentsList(response);
				// Initialize attendance status for all students as present
				const initialStatus = {};
				response.forEach((student) => {
					initialStatus[student._id] = true;
				});
				setAttendanceStatus(initialStatus);
			}
		} catch (error) {
			console.error("Error fetching students list:", error);
		}
	};

	useEffect(() => {
		if (lectureId) {
			getStudentsList();
		}
	}, [lectureId]);

	// Cleanup function to clear the lecture data when component unmounts
	useEffect(() => {
		return () => {
			dispatch(clearMarkAttendanceLecture());
		};
	}, []);

	const handleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		const newStatus = {};
		studentsList.forEach((student) => {
			newStatus[student._id] = newSelectAll;
		});
		setAttendanceStatus(newStatus);
	};

	const handleStudentAttendance = (studentId) => {
		setAttendanceStatus((prev) => ({
			...prev,
			[studentId]: !prev[studentId],
		}));
	};

	const handleSubmitAttendance = async () => {
		setIsSubmitting(true);
		try {
			const data = studentsList.map((student) =>
				dispatch(
					markAttendance(
						lectureId,
						student._id,
						attendanceStatus[student._id]
							? "Present"
							: "Absent",
						token
					)
				)
			);

			const results = await Promise.all(data);
			const allSuccessful = results.every((result) => result);

			if (allSuccessful) {
				toast.success("Attendance marked successfully");
				navigate("/dashboard/admin-attendance/mark-attendance");
			}
		} catch (error) {
			console.error("Error submitting attendance:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// If no lecture data is available, redirect back
	if (!markAttendanceLecture) {
		navigate("/dashboard/admin-attendance/mark-attendance");
		return null;
	}

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-richblack-5">
					Mark Attendance
				</h3>
				<button
					onClick={() =>
						navigate(
							"/dashboard/admin-attendance/mark-attendance"
						)
					}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<IoArrowBack className="text-lg" />
					Back
				</button>
			</div>

			{/* Lecture Details Card */}
			{markAttendanceLecture && (
				<div className="bg-richblack-800 p-6 rounded-xl shadow-lg mb-8">
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-2xl font-bold text-richblack-5 mb-2">
								{markAttendanceLecture.subject?.name}
							</h2>
							<p className="text-richblack-200">
								{format(
									new Date(
										markAttendanceLecture.date
									),
									"PPP"
								)}
							</p>
						</div>
						<div className="text-right">
							<p className="text-richblack-200">
								<span className="text-medium-gray">
									Time:{" "}
								</span>
								{markAttendanceLecture.time}
							</p>
							<p className="text-richblack-200">
								<span className="text-medium-gray">
									Tutor:{" "}
								</span>
								{markAttendanceLecture.tutor?.name}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Attendance Table */}
			<div className="bg-richblack-800 rounded-xl shadow-lg overflow-hidden">
				<div className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b bg-gray-200 rounded-2xl border-richblack-700">
									<th className="py-3 px-4 text-left text-richblack-200">
										Student Name
									</th>
									<th className="py-3 px-4 text-left text-richblack-200 flex items-center gap-2 ">
										Status
										<input
											type="checkbox"
											checked={selectAll}
											onChange={
												handleSelectAll
											}
											className="h-4 w-4 rounded border-richblack-300 text-yellow-50 focus:ring-yellow-50"
										/>
									</th>
								</tr>
							</thead>
							<tbody>
								{studentsList.map((student) => (
									<tr
										key={student._id}
										className="border-b border-richblack-700"
									>
										<td className="py-3 px-4 text-richblack-5  ">
											{student.name}
										</td>
										<td className="py-3 px-4 pl-10 ">
											<input
												type="checkbox"
												checked={
													attendanceStatus[
														student
															._id
													]
												}
												onChange={() =>
													handleStudentAttendance(
														student._id
													)
												}
												className="h-4 w-4 rounded border-richblack-300 text-yellow-50 focus:ring-yellow-50"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-6 flex justify-end">
						<button
							onClick={handleSubmitAttendance}
							disabled={isSubmitting}
							className={`px-4 py-2 rounded-lg font-medium text-white ${
								isSubmitting
									? "bg-richblack-700 text-richblack-300 cursor-not-allowed"
									: "bg-medium-gray text-richblack-900 hover:bg-charcoal-gray"
							} transition-all duration-200`}
						>
							{isSubmitting
								? "Submitting..."
								: "Submit Attendance"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainMarking;
