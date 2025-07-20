import React, { useEffect, useState } from "react";
import { getMyStudentsListByLec } from "../../../../services/operations/users.service";
import { markAttendance } from "../../../../services/operations/attendance.service";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { clearmarkLecture } from "../../../../slices/attendance.slice";
import { FaArrowLeftLong, FaUser, FaClock, FaBook } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function MainMarking() {
	const { token } = useSelector((state) => state.auth);
	const { markLecture } = useSelector((state) => state.attendance);
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
			dispatch(clearmarkLecture());
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
	if (!markLecture) {
		navigate("/dashboard/admin-attendance/mark-attendance");
		return null;
	}

	const presentCount =
		Object.values(attendanceStatus).filter(Boolean).length;
	const absentCount = studentsList.length - presentCount;

	return (
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">
						Mark Attendance
					</h1>
				</div>

				<button
					onClick={() =>
						navigate(
							"/dashboard/admin-attendance/mark-attendance"
						)
					}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Lecture Details Card */}
			{markLecture && (
				<div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
					<h2 className="text-xl font-semibold text-charcoal-gray mb-4">
						Lecture Details
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
									{markLecture.subject?.name}
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
									{format(
										new Date(markLecture.date),
										"dd MMM yyyy"
									)}
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
									{markLecture.time}
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
									{markLecture.tutor?.name}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Attendance Table */}
			<div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-charcoal-gray">
							Student Attendance
						</h3>
						<div className="flex items-center gap-2">
							<label className="text-sm text-medium-gray">
								Select All Present:
							</label>
							<input
								type="checkbox"
								checked={selectAll}
								onChange={handleSelectAll}
								className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-light-gray">
									<th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
										Student Name
									</th>
									<th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
										Present
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-light-gray">
								{studentsList.map((student) => (
									<tr
										key={student._id}
										className="hover:bg-light-gray/30"
									>
										<td className="py-3 px-4 text-sm text-charcoal-gray font-medium">
											{student.name}
										</td>
										<td className="py-3 px-4 text-center">
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
												className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Submit Button */}
					<div className="mt-6 flex justify-end">
						<button
							onClick={handleSubmitAttendance}
							disabled={isSubmitting}
							className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
								isSubmitting
									? "bg-light-gray text-slate-gray cursor-not-allowed"
									: "bg-charcoal-gray text-white hover:bg-medium-gray"
							}`}
						>
							{isSubmitting
								? "Submitting..."
								: "Submit Attendance"}
						</button>
					</div>

					{/* Attendance Stats */}
					<div className="grid grid-cols-3 mt-10 gap-4 mb-6">
						<div className="bg-light-gray p-4 rounded-lg text-center">
							<p className="text-xs text-slate-gray">
								Total Students
							</p>
							<p className="text-lg font-bold text-charcoal-gray">
								{studentsList.length}
							</p>
						</div>
						<div className="bg-light-gray p-4 rounded-lg text-center">
							<p className="text-xs text-slate-gray">
								Present
							</p>
							<p className="text-lg font-bold text-charcoal-gray">
								{presentCount}
							</p>
						</div>
						<div className="bg-light-gray p-4 rounded-lg text-center">
							<p className="text-xs text-slate-gray">
								Absent
							</p>
							<p className="text-lg font-bold text-medium-gray">
								{absentCount}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainMarking;
