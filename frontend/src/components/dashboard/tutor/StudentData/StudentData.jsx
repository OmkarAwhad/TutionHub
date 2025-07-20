import React, { useEffect, useState } from "react";
import {
	getMyDetails,
	getMyStudentsList,
} from "../../../../services/operations/users.service";
import { getAllStandards } from "../../../../services/operations/standard.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdSend } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa6";
import {
	attendAccToSub,
	StudAttendAccToSubForTutor,
} from "../../../../services/operations/attendance.service";
import { addARemark } from "../../../../services/operations/remarks.service";

function StudentData() {
	const [subject, setSubject] = useState(null);
	const [remarks, setRemarks] = useState({});
	const [standards, setStandards] = useState([]);
	const [activeStandard, setActiveStandard] = useState("");
	const [allStudentsData, setAllStudentsData] = useState({});
	const [loading, setLoading] = useState(true);

	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Fetch standards
	const fetchStandards = async () => {
		try {
			const response = await dispatch(getAllStandards(token));
			// console.log("Standards response:", response);

			if (response) {
				const standardsArray = response.standards || response;
				setStandards(standardsArray);

				// Set first standard as active by default
				if (standardsArray && standardsArray.length > 0) {
					setActiveStandard(standardsArray[0]._id);
					// console.log(
					// 	"Active standard set to:",
					// 	standardsArray[0]._id
					// );
				}
			}
		} catch (error) {
			console.error("Error fetching standards:", error);
			toast.error("Failed to fetch standards");
		}
	};

	const getSubject = async () => {
		try {
			const response = await dispatch(getMyDetails(token));
			if (
				response &&
				response.subjects &&
				response.subjects.length > 0
			) {
				setSubject(response.subjects[0]._id);
			}
		} catch (error) {
			console.error("Error fetching subject details:", error);
			toast.error("Failed to fetch subject details");
		}
	};

	const fetchStudentsList = async () => {
		if (!subject) return;

		setLoading(true);
		try {
			const response = await dispatch(getMyStudentsList(token));
			// console.log("Students response:", response);

			if (response && response.length > 0) {
				const data = {};

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
							data[student._id] = {
								...result,
								studentInfo: student,
							};
						}
					} catch (error) {
						console.error(
							"Error fetching attendance for student:",
							student._id,
							error
						);
					}
				}

				// console.log("All students data:", data);
				setAllStudentsData(data);
			}
		} catch (error) {
			console.error("Error in fetchStudentsList:", error);
			toast.error("Error in fetching students list");
		} finally {
			setLoading(false);
		}
	};

	// Filter students based on active standard
	const getFilteredStudents = () => {
		// console.log("Filtering students...");
		// console.log("Active standard:", activeStandard);
		// console.log("All students data:", allStudentsData);

		if (!allStudentsData || !activeStandard) {
			// console.log("No data or active standard");
			return [];
		}

		const filtered = Object.entries(allStudentsData).filter(
			([studentId, data]) => {
				// Check if attendance data exists and has valid structure
				if (!data || !data.attendanceDetails) {
					// console.log(`No attendance data for ${studentId}`);
					return false;
				}

				// Check if attendanceDetails array has data
				if (
					!Array.isArray(data.attendanceDetails) ||
					data.attendanceDetails.length === 0
				) {
					// console.log(`No attendance details for ${studentId}`);
					return false;
				}

				// Check if student name exists and is not empty
				const studentName =
					data.attendanceDetails[0]?.student?.name;
				if (
					!studentName ||
					studentName.trim() === "" ||
					studentName === "N/A"
				) {
					// console.log(`Invalid name for ${studentId}`);
					return false;
				}

				// Filter by standard
				const studentStandardId =
					data.studentInfo?.profile?.standard?._id;
				// console.log(
				// 	`Student ${studentName} standard:`,
				// 	studentStandardId,
				// 	"vs active:",
				// 	activeStandard
				// );

				if (studentStandardId !== activeStandard) {
					// console.log(`Standard mismatch for ${studentName}`);
					return false;
				}

				return true;
			}
		);

		// console.log("Filtered students:", filtered);
		return filtered;
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

		setRemarks((prev) => ({
			...prev,
			[studentId]: "",
		}));
	};

	const handleStandardClick = (standardId) => {
		// console.log("Standard clicked:", standardId);
		setActiveStandard(standardId);
	};

	// useEffects
	useEffect(() => {
		fetchStandards();
		getSubject();
	}, []);

	useEffect(() => {
		if (subject && activeStandard) {
			// console.log(
			// 	"Subject and activeStandard ready, fetching students:",
			// 	{ subject, activeStandard }
			// );
			fetchStudentsList();
		}
	}, [subject, activeStandard]);

	const filteredStudents = getFilteredStudents();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Students</h1>
			</div>

			{/* Standards Filter Buttons + Subject Info in Flex Layout */}
			<div className="mb-8 flex gap-6">
				{/* Standards Filter Buttons - Left Side */}
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-4">
						<FaGraduationCap className="text-charcoal-gray text-xl" />
						<h2 className="text-xl font-semibold text-charcoal-gray">
							Filter by Standard
						</h2>
					</div>
					<div className="flex gap-4">
						{standards &&
							standards.map((standard) => (
								<button
									key={standard._id}
									onClick={() =>
										handleStandardClick(
											standard._id
										)
									}
									className={`px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg ${
										activeStandard ===
										standard._id
											? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30 ring-4 ring-charcoal-gray/20"
											: "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
									}`}
								>
									<div className="flex items-center gap-2">
										<FaGraduationCap className="text-lg" />
										{standard.standardName}
									</div>
								</button>
							))}
					</div>
				</div>

				{/* Subject Info Cards - Right Side */}
				<div className="flex-1">
					<div className="grid grid-cols-3 gap-4 h-full">
						{/* Subject Info Card */}
						<div className="bg-white p-4 rounded-xl shadow-lg border border-light-gray">
							<div className="text-center">
								<h3 className="text-sm font-semibold text-medium-gray mb-2">
									Subject Info
								</h3>
								<p className="text-sm mb-2 text-charcoal-gray font-medium">
									{filteredStudents.length > 0 &&
									filteredStudents[0][1]
										.attendanceDetails.length >
										0 &&
									filteredStudents[0][1]
										.attendanceDetails[0].lecture
										.subject?.name
										? filteredStudents[0][1]
												.attendanceDetails[0]
												.lecture.subject
												.name
										: "N/A"}
								</p>
								<p className="text-xs text-slate-gray">
									Code:{" "}
									{filteredStudents.length > 0 &&
									filteredStudents[0][1]
										.attendanceDetails.length >
										0 &&
									filteredStudents[0][1]
										.attendanceDetails[0].lecture
										.subject?.code
										? filteredStudents[0][1]
												.attendanceDetails[0]
												.lecture.subject
												.code
										: "N/A"}
								</p>
							</div>
						</div>

						{/* Lectures Info Card */}
						<div className="bg-white p-4 rounded-xl shadow-lg border border-light-gray">
							<div className="text-center">
								<h3 className="text-sm font-semibold text-medium-gray mb-2">
									Lectures
								</h3>
								<p className="text-lg font-bold text-charcoal-gray">
									{filteredStudents.length > 0 &&
									filteredStudents[0][1]
										.statistics &&
									filteredStudents[0][1].statistics
										.totalLectures
										? filteredStudents[0][1]
												.statistics
												.totalLectures
										: "0"}
								</p>
								<p className="text-xs text-slate-gray">
									Marked:{" "}
									{filteredStudents.length > 0 &&
									filteredStudents[0][1]
										.statistics &&
									filteredStudents[0][1].statistics
										.markedLectures
										? filteredStudents[0][1]
												.statistics
												.markedLectures
										: "0"}
								</p>
							</div>
						</div>

						{/* Standard Info Card */}
						<div className="bg-white p-4 rounded-xl shadow-lg border border-light-gray">
							<div className="text-center">
								<h3 className="text-sm font-semibold text-medium-gray mb-2">
									Standard
								</h3>
								<p className="text-lg font-bold text-charcoal-gray">
									{standards.find(
										(s) =>
											s._id === activeStandard
									)?.standardName || "N/A"}
								</p>
								<p className="text-xs text-slate-gray">
									Students: {filteredStudents.length}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Students Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white rounded-lg shadow-sm">
					<thead className="bg-gray-200">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
								Student Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
								Standard
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
					<tbody className="bg-white">
						{filteredStudents.map(
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
								const studentStandard =
									attendanceData.studentInfo?.profile
										?.standard?.standardName ||
									"N/A";

								return (
									<tr
										key={studentId}
										className="hover:bg-gray-50"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{studentName}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												{studentStandard}
											</span>
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

				{filteredStudents.length === 0 && !loading && (
					<div className="text-center py-12">
						<FaGraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
						<p className="text-gray-500 text-xl mb-2">
							No students found for{" "}
							{standards.find(
								(s) => s._id === activeStandard
							)?.standardName || "this standard"}
						</p>
						<p className="text-gray-400">
							Try selecting a different standard or check
							if students are assigned to this standard
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default StudentData;
