import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
	getMarksForEdit,
	updateMarksInBulk,
	deleteMarksForLecture,
} from "../../../../services/operations/marks.service";
import {
	FaArrowLeftLong,
	FaUser,
	FaClock,
	FaBook,
	FaTrash,
} from "react-icons/fa6";
import {
	FaChalkboardTeacher,
	FaSearch,
	FaEdit,
	FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

function EditMarks() {
	const { lectureId } = useParams();
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [lectureData, setLectureData] = useState(null);
	const [studentsData, setStudentsData] = useState([]);
	const [filteredStudents, setFilteredStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [totalMarks, setTotalMarks] = useState("");
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchMarksData = async () => {
			try {
				setLoading(true);
				const response = await dispatch(
					getMarksForEdit(lectureId, token)
				);
				if (response) {
					setLectureData(response.lecture);
					setStudentsData(response.studentsWithMarks);
					setFilteredStudents(response.studentsWithMarks);
					setTotalMarks(response.defaultTotalMarks.toString());
				}
			} catch (error) {
				console.error("Error fetching marks data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (lectureId) {
			fetchMarksData();
		}
	}, [lectureId, dispatch, token]);

	// Search functionality
	useEffect(() => {
		if (!searchTerm.trim()) {
			setFilteredStudents(studentsData);
		} else {
			const filtered = studentsData.filter(
				(student) =>
					student.name
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					student.description
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					student.marks?.toString().includes(searchTerm)
			);
			setFilteredStudents(filtered);
		}
	}, [searchTerm, studentsData]);

	const handleMarksChange = (studentId, value) => {
		setStudentsData((prevData) =>
			prevData.map((student) =>
				student._id === studentId
					? {
							...student,
							marks: value === "" ? 0 : Number(value),
					  }
					: student
			)
		);
	};

	const handleDescriptionChange = (studentId, value) => {
		setStudentsData((prevData) =>
			prevData.map((student) =>
				student._id === studentId
					? { ...student, description: value }
					: student
			)
		);
	};

	const handleUpdateMarks = async () => {
		if (!totalMarks || totalMarks <= 0) {
			toast.error("Please enter valid total marks");
			return;
		}

		setIsSubmitting(true);
		try {
			const marksData = studentsData.map((student) => ({
				studentId: student._id,
				marks: student.marks,
				description: student.description || "",
			}));

			const success = await dispatch(
				updateMarksInBulk(
					lectureId,
					marksData,
					Number(totalMarks),
					token
				)
			);

			if (success) {
				navigate("/dashboard/admin-marks/view-marks");
			}
		} catch (error) {
			console.error("Error updating marks:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteMarks = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete all marks for this test? This action cannot be undone."
		);

		if (confirmDelete) {
			const success = await dispatch(
				deleteMarksForLecture(lectureId, token)
			);
			if (success) {
				navigate("/dashboard/admin-marks/view-marks");
			}
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	if (!lectureData) {
		navigate("/dashboard/admin-marks/view-marks");
		return null;
	}

	return (
		<div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
			{/* Header - Responsive */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
				<div className="flex items-center gap-3">
					<FaEdit className="text-charcoal-gray text-xl sm:text-2xl" />
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						Edit Marks
					</h1>
				</div>

				<button
					onClick={() =>
						navigate("/dashboard/admin-marks/view-marks")
					}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Test Details - Responsive Grid */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
				<h2 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-4">
					Test Details
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaBook className="text-charcoal-gray flex-shrink-0" />
						<div className="min-w-0">
							<p className="text-xs text-slate-gray">
								Subject
							</p>
							<p className="text-sm font-semibold text-charcoal-gray truncate">
								{lectureData.subject?.name}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaCalendarAlt className="text-medium-gray flex-shrink-0" />
						<div className="min-w-0">
							<p className="text-xs text-slate-gray">
								Date
							</p>
							<p className="text-sm font-semibold text-charcoal-gray truncate">
								{format(
									new Date(lectureData.date),
									"dd MMM yyyy"
								)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaClock className="text-medium-gray flex-shrink-0" />
						<div className="min-w-0">
							<p className="text-xs text-slate-gray">
								Time
							</p>
							<p className="text-sm font-semibold text-charcoal-gray truncate">
								{lectureData.time}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaUser className="text-charcoal-gray flex-shrink-0" />
						<div className="min-w-0">
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

			{/* Total Marks Input - Responsive */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex-1 w-full sm:mr-4">
						<label className="block text-sm font-medium text-charcoal-gray mb-2">
							Total Marks
						</label>
						<input
							type="number"
							value={totalMarks}
							onChange={(e) =>
								setTotalMarks(e.target.value)
							}
							className="w-full px-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
							placeholder="Enter total marks"
						/>
					</div>
					<button
						onClick={handleDeleteMarks}
						className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-medium-gray text-white rounded-lg hover:bg-charcoal-gray transition-colors duration-200"
					>
						<FaTrash className="text-sm" />
						<span>Delete All</span>
					</button>
				</div>
			</div>

			{/* Search Bar */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
					<input
						type="text"
						placeholder="Search by student name, marks, or description..."
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

			{/* Marks Table - Responsive */}
			<div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
				<div className="p-4 sm:p-6">
					<h3 className="text-lg font-semibold text-charcoal-gray mb-4">
						Student Marks
						{searchTerm && (
							<span className="text-sm font-normal text-medium-gray ml-2">
								({filteredStudents.length} results)
							</span>
						)}
					</h3>

					{filteredStudents.length > 0 ? (
						<>
							{/* Mobile Card View */}
							<div className="block sm:hidden space-y-4">
								{filteredStudents.map((student) => (
									<div
										key={student._id}
										className="bg-light-gray/30 p-4 rounded-lg border border-light-gray"
									>
										<h4 className="font-medium text-charcoal-gray mb-3">
											{student.name}
										</h4>
										<div className="space-y-3">
											<div>
												<label className="block text-xs text-slate-gray mb-1">
													Marks
												</label>
												<input
													type="number"
													value={
														student.marks ||
														""
													}
													onChange={(
														e
													) =>
														handleMarksChange(
															student._id,
															e
																.target
																.value
														)
													}
													className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
													placeholder="Enter marks"
												/>
											</div>
											<div>
												<label className="block text-xs text-slate-gray mb-1">
													Description
												</label>
												<input
													type="text"
													value={
														student.description ||
														""
													}
													onChange={(
														e
													) =>
														handleDescriptionChange(
															student._id,
															e
																.target
																.value
														)
													}
													className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
													placeholder="Enter description (Optional)"
												/>
											</div>
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
											<th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
												Marks
											</th>
											<th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
												Description
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
													<td className="py-3 px-4 text-sm font-medium text-charcoal-gray">
														{
															student.name
														}
													</td>
													<td className="py-3 px-4">
														<input
															type="number"
															value={
																student.marks ||
																""
															}
															onChange={(
																e
															) =>
																handleMarksChange(
																	student._id,
																	e
																		.target
																		.value
																)
															}
															className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
															placeholder="Enter marks"
														/>
													</td>
													<td className="py-3 px-4">
														<input
															type="text"
															value={
																student.description ||
																""
															}
															onChange={(
																e
															) =>
																handleDescriptionChange(
																	student._id,
																	e
																		.target
																		.value
																)
															}
															className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
															placeholder="Enter description (Optional)"
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
					<div className="mt-6 flex justify-end">
						<button
							onClick={handleUpdateMarks}
							disabled={isSubmitting}
							className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
								isSubmitting
									? "bg-light-gray text-slate-gray cursor-not-allowed"
									: "bg-charcoal-gray text-white hover:bg-medium-gray"
							}`}
						>
							{isSubmitting
								? "Updating..."
								: "Update Marks"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditMarks;
