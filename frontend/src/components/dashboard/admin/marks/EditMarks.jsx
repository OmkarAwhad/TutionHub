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
import { FaChalkboardTeacher, FaEdit, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function EditMarks() {
	const { lectureId } = useParams();
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [lectureData, setLectureData] = useState(null);
	const [studentsData, setStudentsData] = useState([]);
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
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<FaEdit className="text-charcoal-gray text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">
						Edit Marks
					</h1>
				</div>

				<button
					onClick={() =>
						navigate("/dashboard/admin-marks/view-marks")
					}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Test Details */}
			<div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
				<h2 className="text-xl font-semibold text-charcoal-gray mb-4">
					Test Details
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaBook className="text-charcoal-gray" />
						<div>
							<p className="text-xs text-slate-gray">
								Subject
							</p>
							<p className="text-sm font-semibold text-charcoal-gray">
								{lectureData.subject?.name}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaCalendarAlt className="text-medium-gray" />
						<div>
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

					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaClock className="text-medium-gray" />
						<div>
							<p className="text-xs text-slate-gray">
								Time
							</p>
							<p className="text-sm font-semibold text-charcoal-gray">
								{lectureData.time}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
						<FaUser className="text-charcoal-gray" />
						<div>
							<p className="text-xs text-slate-gray">
								Tutor
							</p>
							<p className="text-sm font-semibold text-charcoal-gray">
								{lectureData.tutor?.name}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Total Marks Input */}
			<div className="bg-white p-6 rounded-lg shadow-md border border-light-gray mb-6">
				<div className="flex items-center justify-between">
					<div className="flex-1 mr-4">
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
						className="flex items-center gap-2 px-4 py-2 bg-medium-gray text-white rounded-lg hover:bg-charcoal-gray transition-colors duration-200"
					>
						<FaTrash className="text-sm" />
						<span>Delete All</span>
					</button>
				</div>
			</div>

			{/* Marks Table */}
			<div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
				<div className="p-6">
					<h3 className="text-lg font-semibold text-charcoal-gray mb-4">
						Student Marks
					</h3>

					<div className="overflow-x-auto">
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
								{studentsData.map((student) => (
									<tr
										key={student._id}
										className="hover:bg-light-gray/30"
									>
										<td className="py-3 px-4 text-sm font-medium text-charcoal-gray">
											{student.name}
										</td>
										<td className="py-3 px-4">
											<input
												type="number"
												value={
													student.marks ||
													""
												}
												onChange={(e) =>
													handleMarksChange(
														student._id,
														e.target
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
												onChange={(e) =>
													handleDescriptionChange(
														student._id,
														e.target
															.value
													)
												}
												className="w-full px-3 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
												placeholder="Enter description (Optional)"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Update Button */}
					<div className="mt-6 flex justify-end">
						<button
							onClick={handleUpdateMarks}
							disabled={isSubmitting}
							className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
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
