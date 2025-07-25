import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
	getAttendanceForEdit,
	updateAttendance,
	deleteAttendanceForLecture,
} from "../../../../services/operations/attendance.service";
import {
	FaArrowLeftLong,
	FaUser,
	FaClock,
	FaBook,
	FaTrash,
} from "react-icons/fa6";
import {
	FaChalkboardTeacher,
	FaCalendarAlt,
	FaSearch,
	FaEdit,
} from "react-icons/fa";
import toast from "react-hot-toast";

function EditAttendance() {
	const { lectureId } = useParams();
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [lectureData, setLectureData] = useState(null);
	const [studentsData, setStudentsData] = useState([]);
	const [filteredStudents, setFilteredStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [attendanceStatus, setAttendanceStatus] = useState({});
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectAll, setSelectAll] = useState(false);

	useEffect(() => {
		const fetchAttendanceData = async () => {
			try {
				setLoading(true);
				const response = await dispatch(
					getAttendanceForEdit(lectureId, token)
				);
				if (response) {
					setLectureData(response.lecture);
					setStudentsData(response.studentsWithAttendance);
					setFilteredStudents(response.studentsWithAttendance);

					// Initialize attendance status
					const initialStatus = {};
					response.studentsWithAttendance.forEach((student) => {
						if (student.status) {
							initialStatus[student._id] =
								student.status === "Present";
						}
					});
					setAttendanceStatus(initialStatus);
				}
			} catch (error) {
				console.error("Error fetching attendance data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (lectureId) {
			fetchAttendanceData();
		}
	}, [lectureId, dispatch, token]);

	// Search functionality
	useEffect(() => {
		if (!searchTerm.trim()) {
			setFilteredStudents(studentsData);
		} else {
			const filtered = studentsData.filter((student) =>
				student.name
					?.toLowerCase()
					.includes(searchTerm.toLowerCase())
			);
			setFilteredStudents(filtered);
		}
	}, [searchTerm, studentsData]);

	const handleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		const newStatus = {};
		filteredStudents.forEach((student) => {
			newStatus[student._id] = newSelectAll;
		});
		setAttendanceStatus((prev) => ({ ...prev, ...newStatus }));
	};

	const handleUpdateAttendance = async () => {
		setIsSubmitting(true);
		try {
			const attendanceData = studentsData
				.map((student) => ({
					studentId: student._id,
					status: attendanceStatus[student._id]
						? "Present"
						: attendanceStatus[student._id] === false
						? "Absent"
						: null,
				}))
				.filter((data) => data.status !== null);

			const success = await dispatch(
				updateAttendance(lectureId, attendanceData, token)
			);

			if (success) {
				navigate("/dashboard/admin-attendance/view-attendance");
			}
		} catch (error) {
			console.error("Error updating attendance:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteAttendance = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete all attendance for this lecture? This action cannot be undone."
		);

		if (confirmDelete) {
			const success = await dispatch(
				deleteAttendanceForLecture(lectureId, token)
			);
			if (success) {
				navigate("/dashboard/admin-attendance/view-attendance");
			}
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	if (!lectureData) {
		navigate("/dashboard/admin-attendance/view-attendance");
		return null;
	}

	const presentCount =
		Object.values(attendanceStatus).filter(Boolean).length;
	const absentCount = Object.values(attendanceStatus).filter(
		(status) => status === false
	).length;
	const unmarkedCount = studentsData.length - presentCount - absentCount;

	return (
		<div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
			{/* Header - Responsive */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<FaEdit className="text-charcoal-gray text-xl sm:text-2xl" />
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						Edit Attendance
					</h1>
				</div>

				<button
					onClick={() =>
						navigate(
							"/dashboard/admin-attendance/view-attendance"
						)
					}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Lecture Details - Responsive Grid */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-4 sm:mb-6">
				<h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-3 sm:mb-4">
					Lecture Details
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					<div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
						<FaBook className="text-charcoal-gray text-sm flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs text-slate-gray">
								Subject
							</p>
							<p className="text-sm font-semibold text-charcoal-gray truncate">
								{lectureData.subject?.name}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
						<FaCalendarAlt className="text-medium-gray text-sm flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs text-slate-gray">
								Date
							</p>
							<p className="text-sm font-semibold text-charcoal-gray">
								{format(
									new Date(lectureData.date),
									"dd MMM yyyy"
								)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
						<FaClock className="text-medium-gray text-sm flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs text-slate-gray">
								Time
							</p>
							<p className="text-sm font-semibold text-charcoal-gray">
								{lectureData.time}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-light-gray rounded-lg">
						<FaUser className="text-charcoal-gray text-sm flex-shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-xs text-slate-gray">
								Tutor
							</p>
							<p className="text-sm font-semibold text-charcoal-gray truncate">
								{lectureData.tutor?.name}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Search Bar */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-4 sm:mb-6">
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
					<input
						type="text"
						placeholder="Search by student name..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
					/>
				</div>
				{searchTerm && (
					<div className="mt-2">
						<p className="text-sm text-medium-gray">
							Showing {filteredStudents.length} of{" "}
							{studentsData.length} students
						</p>
					</div>
				)}
			</div>

			{/* Attendance Stats - Responsive Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
				<div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">
						{searchTerm ? "Filtered" : "Total"} Students
					</p>
					<p className="text-base sm:text-lg font-bold text-charcoal-gray">
						{searchTerm
							? filteredStudents.length
							: studentsData.length}
					</p>
				</div>
				<div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">Present</p>
					<p className="text-base sm:text-lg font-bold text-charcoal-gray">
						{presentCount}
					</p>
				</div>
				<div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">Absent</p>
					<p className="text-base sm:text-lg font-bold text-medium-gray">
						{absentCount}
					</p>
				</div>
				<div className="bg-light-gray p-3 sm:p-4 rounded-lg text-center">
					<p className="text-xs text-slate-gray">Unmarked</p>
					<p className="text-base sm:text-lg font-bold text-slate-gray">
						{unmarkedCount}
					</p>
				</div>
			</div>

			{/* Attendance Section */}
			<div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
				<div className="p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
						<h3 className="text-base sm:text-lg font-semibold text-charcoal-gray">
							Student Attendance
							{searchTerm && (
								<span className="text-sm font-normal text-medium-gray ml-2">
									({filteredStudents.length} results)
								</span>
							)}
						</h3>
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
							<div className="flex items-center gap-2">
								<label className="text-xs sm:text-sm text-medium-gray">
									Select All Present:
								</label>
								<input
									type="checkbox"
									checked={selectAll}
									onChange={handleSelectAll}
									className="h-4 w-4 rounded border-light-gray text-charcoal-gray focus:ring-charcoal-gray"
								/>
							</div>
							<button
								onClick={handleDeleteAttendance}
								className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-medium-gray text-white rounded-lg hover:bg-charcoal-gray transition-colors duration-200 text-sm"
							>
								<FaTrash className="text-sm" />
								<span>Delete All</span>
							</button>
						</div>
					</div>

					{filteredStudents.length > 0 ? (
						<>
							{/* Mobile Cards View */}
							<div className="block sm:hidden space-y-3">
								{filteredStudents.map((student) => (
									<div
										key={student._id}
										className="bg-light-gray p-3 rounded-lg"
									>
										<div className="flex justify-between items-center mb-2">
											<h4 className="font-medium text-charcoal-gray text-sm">
												{student.name}
											</h4>
										</div>
										<div className="flex gap-4">
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name={`attendance_${student._id}`}
													checked={
														attendanceStatus[
															student
																._id
														] === true
													}
													onChange={() =>
														setAttendanceStatus(
															(
																prev
															) => ({
																...prev,
																[student._id]: true,
															})
														)
													}
													className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
												/>
												<span className="text-sm text-green-700">
													Present
												</span>
											</label>
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name={`attendance_${student._id}`}
													checked={
														attendanceStatus[
															student
																._id
														] ===
														false
													}
													onChange={() =>
														setAttendanceStatus(
															(
																prev
															) => ({
																...prev,
																[student._id]: false,
															})
														)
													}
													className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
												/>
												<span className="text-sm text-red-700">
													Absent
												</span>
											</label>
											<label className="flex items-center gap-2">
												<input
													type="radio"
													name={`attendance_${student._id}`}
													checked={
														attendanceStatus[
															student
																._id
														] ===
														undefined
													}
													onChange={() =>
														setAttendanceStatus(
															(
																prev
															) => {
																const newState =
																	{
																		...prev,
																	};
																delete newState[
																	student
																		._id
																];
																return newState;
															}
														)
													}
													className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
												/>
												<span className="text-sm text-gray-700">
													Unmarked
												</span>
											</label>
										</div>
									</div>
								))}
							</div>

							{/* Desktop Table View */}
							<div className="hidden sm:block overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-light-gray">
											<th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
												Student Name
											</th>
											<th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
												Present
											</th>
											<th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
												Absent
											</th>
											<th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
												Unmarked
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-light-gray">
										{filteredStudents.map(
											(student) => (
												<tr
													key={
														student._id
													}
													className="hover:bg-light-gray/30"
												>
													<td className="py-3 px-4 text-sm text-charcoal-gray font-medium">
														{
															student.name
														}
													</td>
													<td className="py-3 px-4 text-center">
														<input
															type="radio"
															name={`attendance_${student._id}`}
															checked={
																attendanceStatus[
																	student
																		._id
																] ===
																true
															}
															onChange={() =>
																setAttendanceStatus(
																	(
																		prev
																	) => ({
																		...prev,
																		[student._id]: true,
																	})
																)
															}
															className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
														/>
													</td>
													<td className="py-3 px-4 text-center">
														<input
															type="radio"
															name={`attendance_${student._id}`}
															checked={
																attendanceStatus[
																	student
																		._id
																] ===
																false
															}
															onChange={() =>
																setAttendanceStatus(
																	(
																		prev
																	) => ({
																		...prev,
																		[student._id]: false,
																	})
																)
															}
															className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
														/>
													</td>
													<td className="py-3 px-4 text-center">
														<input
															type="radio"
															name={`attendance_${student._id}`}
															checked={
																attendanceStatus[
																	student
																		._id
																] ===
																undefined
															}
															onChange={() =>
																setAttendanceStatus(
																	(
																		prev
																	) => {
																		const newState =
																			{
																				...prev,
																			};
																		delete newState[
																			student
																				._id
																		];
																		return newState;
																	}
																)
															}
															className="h-4 w-4 text-charcoal-gray focus:ring-charcoal-gray"
														/>
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
							</div>
						</>
					) : (
						<div className="text-center py-8">
							<FaSearch className="mx-auto h-12 w-12 text-slate-gray mb-4" />
							<p className="text-medium-gray text-lg mb-2">
								{searchTerm
									? "No students found matching your search"
									: "No students found"}
							</p>
							{searchTerm && (
								<button
									onClick={() => setSearchTerm("")}
									className="mt-4 px-4 py-2 bg-charcoal-gray text-white rounded-lg hover:bg-medium-gray transition-colors duration-200"
								>
									Clear Search
								</button>
							)}
						</div>
					)}

					{/* Update Button */}
					<div className="mt-4 sm:mt-6 flex justify-end">
						<button
							onClick={handleUpdateAttendance}
							disabled={isSubmitting}
							className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
								isSubmitting
									? "bg-light-gray text-slate-gray cursor-not-allowed"
									: "bg-charcoal-gray text-white hover:bg-medium-gray"
							}`}
						>
							{isSubmitting
								? "Updating..."
								: "Update Attendance"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditAttendance;
