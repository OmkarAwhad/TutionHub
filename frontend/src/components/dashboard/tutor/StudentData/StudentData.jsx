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
import { FaSearch, FaTimes } from "react-icons/fa";
import { StudAttendAccToSubForTutor } from "../../../../services/operations/attendance.service";
import { addARemark } from "../../../../services/operations/remarks.service";

function StudentData() {
	const [subject, setSubject] = useState(null);
	const [remarks, setRemarks] = useState({});
	const [standards, setStandards] = useState([]);
	const [activeStandard, setActiveStandard] = useState("");
	const [allStudentsData, setAllStudentsData] = useState({});
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState(""); // New search state

	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Fetch standards
	const fetchStandards = async () => {
		try {
			const response = await dispatch(getAllStandards(token));

			if (response) {
				const standardsArray = response.standards || response;
				setStandards(standardsArray);

				// Set first standard as active by default
				if (standardsArray && standardsArray.length > 0) {
					setActiveStandard(standardsArray[0]._id);
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

				setAllStudentsData(data);
			}
		} catch (error) {
			console.error("Error in fetchStudentsList:", error);
			toast.error("Error in fetching students list");
		} finally {
			setLoading(false);
		}
	};

	// Filter students based on active standard and search term
	const getFilteredStudents = () => {
		if (!allStudentsData || !activeStandard) {
			return [];
		}

		const filtered = Object.entries(allStudentsData).filter(
			([studentId, data]) => {
				// Check if attendance data exists and has valid structure
				if (!data || !data.attendanceDetails) {
					return false;
				}

				// Check if attendanceDetails array has data
				if (
					!Array.isArray(data.attendanceDetails) ||
					data.attendanceDetails.length === 0
				) {
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
					return false;
				}

				// Filter by standard
				const studentStandardId =
					data.studentInfo?.profile?.standard?._id;

				if (studentStandardId !== activeStandard) {
					return false;
				}

				// Filter by search term
				if (searchTerm.trim() !== "") {
					const searchLower = searchTerm.toLowerCase().trim();
					const nameMatch = studentName
						.toLowerCase()
						.includes(searchLower);
					if (!nameMatch) {
						return false;
					}
				}

				return true;
			}
		);

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
		setActiveStandard(standardId);
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const clearSearch = () => {
		setSearchTerm("");
	};

	// useEffects
	useEffect(() => {
		fetchStandards();
		getSubject();
	}, []);

	useEffect(() => {
		if (subject && activeStandard) {
			fetchStudentsList();
		}
	}, [subject, activeStandard]);

	const filteredStudents = getFilteredStudents();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
					Students
				</h1>
			</div>

			{/* Search Bar */}
			<div className="mb-4 sm:mb-6">
				<div className="max-w-md">
					<label className="block text-sm font-medium text-charcoal-gray mb-2">
						Search Students
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="h-4 w-4 text-slate-gray" />
						</div>
						<input
							type="text"
							placeholder="Search by student name..."
							value={searchTerm}
							onChange={handleSearchChange}
							className="block w-full pl-10 pr-10 py-2 sm:py-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-medium-gray focus:border-medium-gray outline-none transition-colors duration-200 text-sm sm:text-base"
						/>
						{searchTerm && (
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
								<button
									onClick={clearSearch}
									className="text-slate-gray hover:text-charcoal-gray transition-colors duration-200"
									title="Clear search"
								>
									<FaTimes className="h-4 w-4" />
								</button>
							</div>
						)}
					</div>
					{searchTerm && (
						<p className="mt-1 text-xs sm:text-sm text-slate-gray">
							Searching for: "
							<span className="font-medium">
								{searchTerm}
							</span>
							"
						</p>
					)}
				</div>
			</div>

			{/* Standards Filter Section + Subject Info */}
			<div className="mb-6 sm:mb-8 flex flex-col xl:flex-row gap-4 xl:gap-6">
				{/* Standards Filter Buttons - Left Side */}
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-3 sm:mb-4">
						<FaGraduationCap className="text-charcoal-gray text-lg sm:text-xl" />
						<h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray">
							Filter by Standard
						</h2>
					</div>
					<div className="flex flex-wrap gap-2 sm:gap-4">
						{standards &&
							standards.map((standard) => (
								<button
									key={standard._id}
									onClick={() =>
										handleStandardClick(
											standard._id
										)
									}
									className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg ${
										activeStandard ===
										standard._id
											? "bg-charcoal-gray text-white shadow-xl shadow-charcoal-gray/30 ring-4 ring-charcoal-gray/20"
											: "bg-white text-medium-gray border-2 border-light-gray hover:border-charcoal-gray hover:shadow-xl"
									}`}
								>
									<div className="flex items-center gap-2">
										<FaGraduationCap className="text-sm sm:text-lg" />
										<span className="truncate">
											{standard.standardName}
										</span>
									</div>
								</button>
							))}
					</div>
				</div>

				{/* Subject Info Cards - Right Side */}
				<div className="flex-1 xl:max-w-md">
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
						{/* Subject Info Card */}
						<div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-light-gray">
							<div className="text-center">
								<h3 className="text-xs sm:text-sm font-semibold text-medium-gray mb-2">
									Subject Info
								</h3>
								<p className="text-sm sm:text-base mb-2 text-charcoal-gray font-medium truncate">
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
						<div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-light-gray">
							<div className="text-center">
								<h3 className="text-xs sm:text-sm font-semibold text-medium-gray mb-2">
									Lectures
								</h3>
								<p className="text-base sm:text-lg font-bold text-charcoal-gray">
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
						<div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-light-gray">
							<div className="text-center">
								<h3 className="text-xs sm:text-sm font-semibold text-medium-gray mb-2">
									Results
								</h3>
								<p className="text-base sm:text-lg font-bold text-charcoal-gray truncate">
									{standards.find(
										(s) =>
											s._id === activeStandard
									)?.standardName || "N/A"}
								</p>
								<p className="text-xs text-slate-gray">
									{searchTerm
										? `Found: ${filteredStudents.length}`
										: `Students: ${filteredStudents.length}`}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Students Table - Desktop View */}
			<div className="hidden lg:block overflow-x-auto">
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
											{/* Highlight search term in name */}
											{searchTerm ? (
												<span
													dangerouslySetInnerHTML={{
														__html: studentName.replace(
															new RegExp(
																`(${searchTerm})`,
																"gi"
															),
															'<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
														),
													}}
												/>
											) : (
												studentName
											)}
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
			</div>

			{/* Students Cards - Mobile/Tablet View */}
			<div className="block lg:hidden space-y-4">
				{filteredStudents.map(([studentId, attendanceData]) => {
					const studentName =
						attendanceData.attendanceDetails[0].student.name;
					const presentCount =
						attendanceData?.statistics?.present || 0;
					const percentage =
						attendanceData?.statistics?.percentage || "0.00%";
					const studentStandard =
						attendanceData.studentInfo?.profile?.standard
							?.standardName || "N/A";

					return (
						<div
							key={studentId}
							className="bg-white p-4 rounded-lg shadow-md border border-light-gray"
						>
							{/* Student Header */}
							<div className="flex justify-between items-start mb-3">
								<div>
									<h3 className="text-lg font-semibold text-charcoal-gray">
										{/* Highlight search term in name */}
										{searchTerm ? (
											<span
												dangerouslySetInnerHTML={{
													__html: studentName.replace(
														new RegExp(
															`(${searchTerm})`,
															"gi"
														),
														'<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
													),
												}}
											/>
										) : (
											studentName
										)}
									</h3>
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
										{studentStandard}
									</span>
								</div>
								<div className="text-right">
									<div className="flex gap-2 flex-wrap justify-end">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											Present: {presentCount}
										</span>
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
									</div>
								</div>
							</div>

							{/* Remarks Section */}
							<div className="border-t pt-3">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Add Remark:
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Enter remark..."
										value={
											remarks[studentId] || ""
										}
										onChange={(e) =>
											handleRemarkChange(
												studentId,
												e.target.value
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
										className="px-4 py-2 bg-medium-gray text-white rounded-md hover:bg-charcoal-gray cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors flex items-center gap-2"
										title="Submit Remark"
									>
										<IoMdSend className="w-4 h-4" />
										<span className="hidden sm:inline">
											Submit
										</span>
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Empty State */}
			{filteredStudents.length === 0 && !loading && (
				<div className="text-center py-8 sm:py-12">
					<FaGraduationCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
					{searchTerm ? (
						<>
							<p className="text-gray-500 text-lg sm:text-xl mb-2">
								No students found for "{searchTerm}"
							</p>
							<p className="text-gray-400 text-sm sm:text-base mb-4">
								Try adjusting your search term or check
								the spelling
							</p>
							<button
								onClick={clearSearch}
								className="px-4 py-2 bg-medium-gray text-white rounded-lg hover:bg-charcoal-gray transition-colors duration-200"
							>
								Clear Search
							</button>
						</>
					) : (
						<>
							<p className="text-gray-500 text-lg sm:text-xl mb-2">
								No students found for{" "}
								{standards.find(
									(s) => s._id === activeStandard
								)?.standardName || "this standard"}
							</p>
							<p className="text-gray-400 text-sm sm:text-base">
								Try selecting a different standard or
								check if students are assigned to this
								standard
							</p>
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default StudentData;
