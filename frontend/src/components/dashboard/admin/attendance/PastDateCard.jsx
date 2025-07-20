import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { setMarkLecture } from "../../../../slices/attendance.slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUser, FaClock, FaGraduationCap } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { getStandardById } from "../../../../services/operations/standard.service"; // Add this import

function PastDateCard({ lecture, mode = "mark", onAttendanceMarked }) {
	const [standardName, setStandardName] = useState("Loading...");
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// In PastDateCard.jsx, update the isPastDate function:
	const isPastDate = (date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const lectureDate = new Date(date);
		lectureDate.setHours(0, 0, 0, 0);
		return lectureDate <= today; // Changed < to <= to include today
	};

	// Fetch standard name when component mounts
	useEffect(() => {
		const fetchStandardName = async () => {
			if (lecture.standard.standardName) {
				setStandardName(lecture.standard.standardName);
			} else {
				try {
					const response = await dispatch(
						getStandardById(lecture.standard, token)
					);
					// console.log("Standard name ",response)
					if (response?.standardName) {
						setStandardName(response.standardName);
					} else {
						setStandardName("Not specified");
					}
				} catch (error) {
					console.error(
						"Error fetching standard details:",
						error
					);
					setStandardName("Not specified");
				}
			}
		};

		fetchStandardName();
	}, [lecture.standard, token]);

	// Add this to PastDateCard.jsx in the handleCardClick function
	const handleCardClick = () => {
		if (mode === "mark") {
			dispatch(setMarkLecture(lecture));
			navigate(
				`/dashboard/admin-attendance/mark-attendance/${lecture._id}`
			);
		} else if (mode == "view") {
			dispatch(setMarkLecture(lecture));
			navigate(
				`/dashboard/admin-attendance/view-attendance/${lecture._id}`
			);
		} else if (mode == "edit") {
			// Add this condition
			dispatch(setMarkLecture(lecture));
			navigate(
				`/dashboard/admin-attendance/edit-attendance/${lecture._id}`
			);
		} else if (mode == "marks") {
			dispatch(setMarkLecture(lecture));
			navigate(`/dashboard/admin-marks/add-marks/${lecture._id}`);
		} else if (mode == "view-marks") {
			dispatch(setMarkLecture(lecture));
			navigate(`/dashboard/admin-marks/view-marks/${lecture._id}`);
		}
	};

	// Update getButtonText function
	const getButtonText = () => {
		switch (mode) {
			case "mark":
				return "Mark Attendance";
			case "view":
				return "View Attendance";
			case "edit":
				return "Edit Attendance"; // Add this case
			case "marks":
				return "Add Marks";
			case "view-marks":
				return "View Marks";
			default:
				return "Action";
		}
	};

	return (
		<>
			{isPastDate(lecture.date) ? (
				<div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-light-gray">
					{/* Header */}
					<div className="mb-4">
						<h3 className="text-lg font-semibold text-charcoal-gray mb-2">
							{lecture.subject?.name}
						</h3>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-medium-gray">
								<FaBook className="text-sm" />
								<span className="text-sm">
									{lecture.subject?.code}
								</span>
							</div>
							{/* Standard Badge */}
							<div className="flex items-center gap-1 px-2 py-1 bg-light-gray rounded-full">
								<FaGraduationCap className="text-xs text-medium-gray" />
								<span className="text-xs font-medium text-charcoal-gray">
									{standardName}
								</span>
							</div>
						</div>
					</div>

					{/* Info Section */}
					<div className="space-y-3 mb-4">
						{/* Date */}
						<div className="flex items-center gap-3 p-3 shadow rounded-lg">
							<FaCalendarAlt className="text-medium-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Date
								</p>
								<p className="text-sm font-medium text-charcoal-gray">
									{format(
										new Date(lecture.date),
										"dd MMM yyyy"
									)}
								</p>
							</div>
						</div>

						{/* Time */}
						<div className="flex items-center gap-3 p-3 shadow rounded-lg">
							<FaClock className="text-medium-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Time
								</p>
								<p className="text-sm font-medium text-charcoal-gray">
									{lecture.time}
								</p>
							</div>
						</div>

						{/* Tutor */}
						<div className="flex items-center gap-3 p-3 shadow rounded-lg">
							<FaUser className="text-charcoal-gray" />
							<div>
								<p className="text-xs text-slate-gray">
									Tutor
								</p>
								<p className="text-sm font-medium text-charcoal-gray">
									{lecture.tutor?.name}
								</p>
							</div>
						</div>

						{/* Description */}
						{lecture.description && (
							<div className="flex items-center gap-3 p-3 shadow rounded-lg">
								<FiFileText className="text-charcoal-gray" />
								<div>
									<p className="text-xs text-slate-gray ">
										Type
									</p>
									<p className="text-sm font-medium text-charcoal-gray">
										{lecture.description}
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Action Button */}
					<button
						onClick={handleCardClick}
						className="w-full cursor-pointer py-3 px-4 bg-charcoal-gray text-white font-medium rounded-lg hover:bg-medium-gray transition-colors border hover:border-charcoal-gray duration-200"
					>
						{getButtonText()}
					</button>
				</div>
			) : null}
		</>
	);
}

export default PastDateCard;
