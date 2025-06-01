import React, { useEffect, useState } from "react";
import {
	getMyDetails,
	getMyStudentsList,
} from "../../../../services/operations/users.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdSend } from "react-icons/io";
import {
	attendAccToSub,
	StudAttendAccToSubForTutor,
} from "../../../../services/operations/attendance.service";
import { addARemark } from "../../../../services/operations/remarks.service";

function StudentData() {
	const [studentsList, setStudentsList] = useState(null);
	const [subject, setSubject] = useState(null);
	const [remarks, setRemarks] = useState({});

	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const getSubject = async () => {
		try {
			const response = await dispatch(getMyDetails(token));
			if (response) {
				setSubject(response.subjects[0]._id);
			}
		} catch (error) {
			console.error("Error fetching subject details:", error);
			toast.error("Failed to fetch subject details");
		}
	};

	const fetchStudentsList = async () => {
		try {
			const response = await dispatch(getMyStudentsList(token));
			if (response) {
				const data = {};
				let i = 0;
				for (const student of response) {
					try {
						const result = await dispatch(
							StudAttendAccToSubForTutor(
								student._id,
								subject,
								token
							)
						);
						if (result) {
							data[student._id] = result;
							i = i + 1;
						}
					} catch (error) {
						console.error(
							"Error fetching attendance for student:",
							student._id,
							error
						);
					}
				}
				// console.log(data);
				setStudentsList(data);
			}
		} catch (error) {
			toast.error("Error in fetching students list");
		}
	};

	// Function to filter out invalid student records
	const getValidStudents = () => {
		if (!studentsList) return [];

		return Object.entries(studentsList).filter(
			([studentId, attendanceData]) => {
				// Check if attendance data exists and has valid structure
				if (!attendanceData || !attendanceData.attendanceDetails) {
					return false;
				}

				// Check if attendanceDetails array has data
				if (
					!Array.isArray(attendanceData.attendanceDetails) ||
					attendanceData.attendanceDetails.length === 0
				) {
					return false;
				}

				// Check if student name exists and is not empty
				const studentName =
					attendanceData.attendanceDetails[0]?.student?.name;
				if (
					!studentName ||
					studentName.trim() === "" ||
					studentName === "N/A"
				) {
					return false;
				}

				// Check if statistics exist (optional but recommended)
				if (!attendanceData.statistics) {
					console.warn(
						`Student ${studentName} has no statistics data`
					);
				}

				return true;
			}
		);
	};

	const handleRemarkChange = (studentId, value) => {
		setRemarks((prev) => ({
			...prev,
			[studentId]: value,
		}));
	};

	const submitRemark = async (studentId, studentName) => {
		const remark = remarks[studentId];
		if (!remark || remark.trim() === "") {
			toast.error("Please enter a remark");
			return;
		}

		try {
			await addARemark({
				studentId,
				subjectId: subject,
				remark,
				token,
			});
			toast.success(`Remark submitted for ${studentName}`);
		} catch (error) {
			toast.error("Failed to submit remark");
		}

		// Clear the input after submission
		setRemarks((prev) => ({
			...prev,
			[studentId]: "",
		}));
	};

	useEffect(() => {
		if (subject) {
			fetchStudentsList();
		}
	}, [subject, dispatch, token]);

	useEffect(() => {
		getSubject();
	}, [dispatch, token]);

	// Get filtered valid students
	const validStudents = getValidStudents();

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Students</h1>
			</div>

			<div className="flex justify-between p-8 mb-7 bg-white text-medium-gray text-2xl shadow shadow-slate-gray rounded-md animate-slide-in">
				<div>
					<p>
						Subject:{" "}
						<span className="text-charcoal-gray">
							{validStudents.length > 0 &&
							validStudents[0][1].attendanceDetails
								.length > 0 &&
							validStudents[0][1].attendanceDetails[0]
								.lecture.subject?.name
								? validStudents[0][1]
										.attendanceDetails[0].lecture
										.subject.name
								: "N/A"}
						</span>
					</p>
					<p>
						Subject Code:{" "}
						<span className="text-charcoal-gray">
							{validStudents.length > 0 &&
							validStudents[0][1].attendanceDetails
								.length > 0 &&
							validStudents[0][1].attendanceDetails[0]
								.lecture.subject?.code
								? validStudents[0][1]
										.attendanceDetails[0].lecture
										.subject.code
								: "N/A"}
						</span>
					</p>
				</div>
				<div>
					<p>
						Total Lectures:{" "}
						<span className="text-charcoal-gray">
							{validStudents.length > 0 &&
							validStudents[0][1].statistics &&
							validStudents[0][1].statistics.totalLectures
								? validStudents[0][1].statistics
										.totalLectures
								: "N/A"}
						</span>
					</p>
					<p>
						Marked Lectures:{" "}
						<span className="text-charcoal-gray">
							{validStudents.length > 0 &&
							validStudents[0][1].statistics &&
							validStudents[0][1].statistics.markedLectures
								? validStudents[0][1].statistics
										.markedLectures
								: "N/A"}
						</span>
					</p>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white rounded-lg shadow-sm">
					<thead className="bg-gray-200">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
								Student Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
								Present
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
								Attendance %
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
								Remarks
							</th>
						</tr>
					</thead>
					<tbody className="bg-white ">
						{validStudents.map(
							([studentId, attendanceData]) => {
								const studentName =
									attendanceData.attendanceDetails[0]
										.student.name;
								const presentCount =
									attendanceData?.statistics
										?.present || 0;
								const percentage =
									attendanceData?.statistics
										?.percentage || "0.00%";

								return (
									<tr
										key={studentId}
										className="hover:bg-gray-50"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{studentName}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												{presentCount}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													parseFloat(
														percentage
													) >= 75
														? "bg-green-100 text-green-800"
														: parseFloat(
																percentage
													   ) >= 50
														? "bg-yellow-100 text-yellow-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{percentage}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<div className="flex items-center space-x-2">
												<input
													type="text"
													placeholder="Enter remark..."
													value={
														remarks[
															studentId
														] || ""
													}
													onChange={(
														e
													) =>
														handleRemarkChange(
															studentId,
															e
																.target
																.value
														)
													}
													className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medium-gray focus:border-transparent text-sm"
												/>
												<button
													onClick={() =>
														submitRemark(
															studentId,
															studentName
														)
													}
													className="p-2 bg-medium-gray text-white rounded-md hover:bg-charcoal-gray cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
													title="Submit Remark"
												>
													<IoMdSend className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								);
							}
						)}
					</tbody>
				</table>

				{validStudents.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						<p>No valid students data available</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default StudentData;
