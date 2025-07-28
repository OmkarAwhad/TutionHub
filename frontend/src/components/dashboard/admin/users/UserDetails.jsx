import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../../../services/operations/users.service";
import {
	FaUser,
	FaEnvelope,
	FaPhone,
	FaCalendarAlt,
	FaGraduationCap,
	FaUserGraduate,
	FaChalkboardTeacher,
	FaClipboardList,
	FaChartLine,
	FaCommentDots,
} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";

const ACCOUNT_TYPE = {
	STUDENT: "Student",
	TUTOR: "Tutor",
	ADMIN: "Admin",
};

function UserDetails() {
	const { userId } = useParams();
	// console.log("UserDetails.jsx useParams userId:", userId);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				setLoading(true);
				const response = await dispatch(
					getUserDetails(userId, token)
				);
				if (response) {
					// console.log(response);
					setUser(response);
				}
			} catch (error) {
				console.error("Error fetching user details:", error);
				toast.error("Failed to fetch user details");
			} finally {
				setLoading(false);
			}
		};

		// console.log("User id : ", userId);

		if (userId) {
			fetchUserDetails();
		}
	}, [userId, dispatch, token]);

	const getRoleIcon = () => {
		switch (user?.role) {
			case ACCOUNT_TYPE.STUDENT:
				return <FaUserGraduate className="text-xl sm:text-2xl" />;
			case ACCOUNT_TYPE.TUTOR:
				return (
					<FaChalkboardTeacher className="text-xl sm:text-2xl" />
				);
			default:
				return <FaUser className="text-xl sm:text-2xl" />;
		}
	};

	const getRoleBadgeColor = () => {
		switch (user?.role) {
			case ACCOUNT_TYPE.STUDENT:
				return "bg-blue-100 text-blue-800";
			case ACCOUNT_TYPE.TUTOR:
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// if (loading) {
	// 	return (
	// 		<div className="flex items-center justify-center h-[60vh]">
	// 			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
	// 		</div>
	// 	);
	// }

	if (!user) {
		return (
			<div className="text-center py-12">
				<p className="text-medium-gray text-xl">User not found</p>
			</div>
		);
	}

	return (
		<div className="p-3 sm:p-4 lg:p-6 max-w-6xl mx-auto">
			{/* Header - Responsive */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					{getRoleIcon()}
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						User Details
					</h1>
				</div>
				<button
					onClick={() => navigate("/dashboard/admin-users")}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
				>
					<FaArrowLeftLong className="text-sm" />
					<span>Back to Users</span>
				</button>
			</div>

			{/* Profile Card - Toned Down */}
			<div className="bg-white rounded border border-light-gray mb-6">
				<div className="p-6">
					<div className="flex items-start gap-6">
						{/* Avatar */}
						<div className="w-16 h-16 rounded-full bg-charcoal-gray flex items-center justify-center text-white">
							{getRoleIcon()}
						</div>

						{/* Profile Info */}
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-charcoal-gray mb-1">
								{user.name}
							</h2>
							<div className="flex items-center gap-2 mb-3">
								<FaEnvelope className="text-slate-gray text-sm" />
								<span className="text-medium-gray">
									{user.email}
								</span>
							</div>
							<span
								className={`px-2 py-1 text-xs rounded ${getRoleBadgeColor()}`}
							>
								{user.role}
							</span>

							{/* Simple Details Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
								{/* Phone */}
								<div>
									<span className="text-sm text-slate-gray">
										Phone:
									</span>
									<p className="text-charcoal-gray font-medium">
										{user?.profile?.phoneNumber ||
											"Not provided"}
									</p>
								</div>

								{/* Gender */}
								<div>
									<span className="text-sm text-slate-gray">
										Gender:
									</span>
									<p className="text-charcoal-gray font-medium">
										{user?.profile?.gender ||
											"Not specified"}
									</p>
								</div>

								{/* Standard (for students only) */}
								{user?.role ===
									ACCOUNT_TYPE.STUDENT && (
									<div>
										<span className="text-sm text-slate-gray">
											Standard:
										</span>
										<p className="text-charcoal-gray font-medium">
											{user?.profile?.standard
												?.standardName ||
												"Not assigned"}
										</p>
									</div>
								)}

								{/* Admission Date */}
								{user.admissionDate && (
									<div>
										<span className="text-sm text-slate-gray">
											Admission Date:
										</span>
										<p className="text-charcoal-gray font-medium">
											{new Date(
												user.admissionDate
											).toLocaleDateString()}
										</p>
									</div>
								)}

								{/* Subjects - Full Width */}
								<div className="sm:col-span-2">
									<span className="text-sm text-slate-gray">
										Subjects:
									</span>
									<p className="text-charcoal-gray font-medium">
										{Array.isArray(
											user.subjects
										) && user.subjects.length > 0
											? user.subjects
													.map((sub) =>
														typeof sub ===
															"object" &&
														sub !==
															null
															? sub.name
															: sub
													)
													.join(", ")
											: "No subjects assigned"}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Student Management Options */}
			{user && user.role === ACCOUNT_TYPE.STUDENT && (
				<div className="bg-white rounded-lg shadow-md border border-light-gray p-4 sm:p-6 md:p-8">
					<h3 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-4 sm:mb-6 flex items-center gap-2">
						<FaUserGraduate className="text-charcoal-gray" />
						Student Management
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						<NavLink
							to={`/dashboard/admin-users/${userId}/attendance`}
							className="p-4 sm:p-6 bg-charcoal-gray text-white text-center font-semibold text-sm sm:text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg flex items-center justify-center gap-3"
						>
							<FaClipboardList className="text-lg" />
							<span>View Attendance</span>
						</NavLink>
						<NavLink
							to={`/dashboard/admin-users/${userId}/progress`}
							className="p-4 sm:p-6 bg-charcoal-gray text-white text-center font-semibold text-sm sm:text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg flex items-center justify-center gap-3"
						>
							<FaChartLine className="text-lg" />
							<span>Academic Progress</span>
						</NavLink>
						<NavLink
							to={`/dashboard/admin-users/${userId}/remarks`}
							className="p-4 sm:p-6 bg-charcoal-gray text-white text-center font-semibold text-sm sm:text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg flex items-center justify-center gap-3"
						>
							<FaCommentDots className="text-lg" />
							<span>View Remarks</span>
						</NavLink>
					</div>
				</div>
			)}

			{/* Tutor Management Options */}
			{user && user.role === ACCOUNT_TYPE.TUTOR && (
				<div className="bg-white rounded-lg shadow-md border border-light-gray p-4 sm:p-6 md:p-8">
					<h3 className="text-lg sm:text-xl font-semibold text-charcoal-gray mb-4 sm:mb-6 flex items-center gap-2">
						<FaChalkboardTeacher className="text-charcoal-gray" />
						Tutor Management
					</h3>
					<div className=" flex items-center justify-center sm:gap-6">
						<NavLink
							to={`/dashboard/admin-users/${userId}/lectures`}
							className="p-4 sm:p-6 w-[50%] bg-charcoal-gray text-white text-center font-semibold text-sm sm:text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg flex items-center justify-center gap-3"
						>
							<FaChalkboardTeacher className="text-lg" />
							<span>View Lectures</span>
						</NavLink>
						{/* <NavLink
							to={`/dashboard/admin-users/${userId}/performance`}
							className="p-4 sm:p-6 bg-charcoal-gray text-white text-center font-semibold text-sm sm:text-lg rounded-lg hover:bg-medium-gray transition-colors duration-200 hover:shadow-lg flex items-center justify-center gap-3"
						>
							<FaChartLine className="text-lg" />
							<span>Performance Report</span>
						</NavLink> */}
					</div>
				</div>
			)}
		</div>
	);
}

export default UserDetails;
