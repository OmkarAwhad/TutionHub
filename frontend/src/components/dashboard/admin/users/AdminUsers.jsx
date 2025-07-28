import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import {
	FaSearch,
	FaUsers,
	FaUserGraduate,
	FaChalkboardTeacher,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllUsersList } from "../../../../services/operations/users.service";
import toast from "react-hot-toast";
import { getAllSubjects } from "../../../../services/operations/subject.service";

function AdminUsers() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	const [userLists, setUserLists] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [selectedRole, setSelectedRole] = useState("Student");
	const [selectedSubject, setSelectedSubject] = useState("All");
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			let response = await dispatch(getAllUsersList(token));
			if (response) {
				response = response.filter(
					(user) => user.role === selectedRole
				);
				if (selectedSubject !== "All") {
					response = response.filter((user) =>
						Array.isArray(user.subjects)
							? user.subjects.some(
									(sub) =>
										(typeof sub === "object" &&
										sub !== null
											? sub._id
											: String(sub)) ===
										String(selectedSubject)
							  )
							: false
					);
				}
				setUserLists(response);
				setFilteredUsers(response);
			}
		} catch (error) {
			toast.error("Error in fetching users list");
			console.log("Error in fetching users list");
		} finally {
			setLoading(false);
		}
	};

	const fetchSubjects = async () => {
		try {
			const response = await dispatch(getAllSubjects(token));
			if (response) {
				setSubjects(response);
			}
		} catch (error) {
			toast.error("Error in fetching subjects");
			console.log("Error in fetching subjects", error);
		}
	};

	// Search functionality
	useEffect(() => {
		if (!searchTerm.trim()) {
			setFilteredUsers(userLists);
		} else {
			const filtered = userLists.filter(
				(user) =>
					user.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
					// (Array.isArray(user.subjects) &&
					// 	user.subjects.some((sub) =>
					// 		(typeof sub === "object" && sub !== null
					// 			? sub.name
					// 			: ""
					// 		)
					// 			.toLowerCase()
					// 			.includes(searchTerm.toLowerCase())
					// 	))
               
			);
			setFilteredUsers(filtered);
		}
	}, [searchTerm, userLists]);

	useEffect(() => {
		fetchUsers();
	}, [dispatch, token, selectedRole, selectedSubject]);

	useEffect(() => {
		fetchSubjects();
	}, [dispatch, token]);

	const getRoleIcon = () => {
		return selectedRole === "Student" ? (
			<FaUserGraduate />
		) : (
			<FaChalkboardTeacher />
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray"></div>
			</div>
		);
	}

	return (
		<div className="p-3 sm:p-4 lg:p-6">
			{/* Header - Responsive */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<FaUsers className="text-charcoal-gray text-xl sm:text-2xl" />
					<h1 className="text-2xl sm:text-3xl font-bold text-charcoal-gray">
						Manage Users
					</h1>
				</div>
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 px-3 py-2 text-medium-gray hover:text-charcoal-gray transition-colors duration-200 self-start sm:self-auto"
				>
					<IoArrowBack className="text-sm" />
					<span>Back</span>
				</button>
			</div>

			{/* Filters - Responsive */}
			<div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-light-gray mb-6">
				<div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
					{/* Role and Subject Filters */}
					<div className="flex flex-col sm:flex-row gap-4 flex-1">
						<div className="flex-1 sm:max-w-xs">
							<label className="block text-xs text-slate-gray mb-1">
								Role
							</label>
							<select
								value={selectedRole}
								onChange={(e) =>
									setSelectedRole(e.target.value)
								}
								className="w-full px-4 py-2 border border-light-gray rounded-lg bg-white text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
							>
								<option value="Student">
									Students
								</option>
								<option value="Tutor">Tutors</option>
							</select>
						</div>
						<div className="flex-1 sm:max-w-xs">
							<label className="block text-xs text-slate-gray mb-1">
								Subject
							</label>
							<select
								value={selectedSubject}
								onChange={(e) =>
									setSelectedSubject(e.target.value)
								}
								className="w-full px-4 py-2 border border-light-gray rounded-lg bg-white text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
							>
								<option value="All">
									All Subjects
								</option>
								{subjects.map((sub) => (
									<option
										key={sub._id}
										value={sub._id}
									>
										{sub.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Search Bar */}
					<div className="flex-1 lg:max-w-md">
						<label className="block text-xs text-slate-gray mb-1">
							Search
						</label>
						<div className="relative">
							<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray text-sm" />
							<input
								type="text"
								placeholder="Search by name or email"
								value={searchTerm}
								onChange={(e) =>
									setSearchTerm(e.target.value)
								}
								className="w-full pl-10 pr-4 py-2 border border-light-gray rounded-lg text-charcoal-gray focus:outline-none focus:border-charcoal-gray transition-colors duration-200"
							/>
						</div>
					</div>
				</div>

				{/* Results Counter */}
				<div className="mt-4 pt-4 border-t border-light-gray">
					<p className="text-sm text-medium-gray">
						Showing {filteredUsers.length} of{" "}
						{userLists.length} {selectedRole.toLowerCase()}s
						{searchTerm && ` matching "${searchTerm}"`}
					</p>
				</div>
			</div>

			{/* Users List */}
			{filteredUsers.length > 0 ? (
				<div className="bg-white rounded-lg shadow-md border border-light-gray overflow-hidden">
					{/* Mobile Card View */}
					<div className="block md:hidden p-4">
						<div className="space-y-4">
							{filteredUsers.map((user) => (
								<div
									key={user._id}
									className="p-4 bg-light-gray rounded-lg cursor-pointer hover:bg-medium-gray/20 hover:shadow-md transition-all duration-200"
									onClick={() =>
										navigate(
											`/dashboard/admin-users/${user._id}`
										)
									}
								>
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 bg-charcoal-gray rounded-full flex items-center justify-center text-white flex-shrink-0">
											{getRoleIcon()}
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-charcoal-gray truncate">
												{user.name}
											</h3>
											<p className="text-sm text-medium-gray truncate">
												{user.email}
											</p>
											<div className="mt-2">
												<p className="text-xs text-slate-gray">
													Subjects:
												</p>
												<p className="text-sm text-charcoal-gray">
													{Array.isArray(
														user.subjects
													)
														? user.subjects
																.map(
																	(
																		sub
																	) =>
																		typeof sub ===
																			"object" &&
																		sub !==
																			null
																			? sub.name
																			: subjects.find(
																					(
																						s
																					) =>
																						s._id ===
																						sub
                                                         )
                                                            ?.name ||
                                                         ""
																)
																.filter(
																	Boolean
																)
																.join(
																	", "
																) ||
                                          "No subjects assigned"
														: "No subjects assigned"}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Desktop Table View */}
					<div className="hidden md:block">
						<div className="p-4 border-b border-light-gray">
							<h3 className="text-lg font-semibold text-charcoal-gray flex items-center gap-2">
								{getRoleIcon()}
								{selectedRole}s List
								{searchTerm && (
									<span className="text-sm font-normal text-medium-gray">
										({filteredUsers.length}{" "}
										results)
									</span>
								)}
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-light-gray">
									<tr>
										<th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
											Name & Email
										</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-charcoal-gray">
											Subjects
										</th>
										<th className="py-3 px-4 text-center text-sm font-semibold text-charcoal-gray">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-light-gray">
									{filteredUsers.map((user) => (
										<tr
											key={user._id}
											className="hover:bg-light-gray/30"
										>
											<td className="py-4 px-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-charcoal-gray rounded-full flex items-center justify-center text-white flex-shrink-0">
														{getRoleIcon()}
													</div>
													<div>
														<p className="font-medium text-charcoal-gray">
															{
																user.name
															}
														</p>
														<p className="text-sm text-medium-gray">
															{
																user.email
															}
														</p>
													</div>
												</div>
											</td>
											<td className="py-4 px-4">
												<p className="text-sm text-charcoal-gray">
													{Array.isArray(
														user.subjects
													)
														? user.subjects
																.map(
																	(
																		sub
																	) =>
																		typeof sub ===
																			"object" &&
																		sub !==
																			null
																			? sub.name
																			: subjects.find(
																					(
																						s
																					) =>
																						s._id ===
																						sub
																			  )
																					?.name ||
																			  ""
																)
																.filter(
																	Boolean
																)
																.join(
																	", "
																) ||
														  "No subjects assigned"
														: "No subjects assigned"}
												</p>
											</td>
											<td className="py-4 px-4 text-center">
												<button
													onClick={() =>
														navigate(
															`/dashboard/admin-users/${user._id}`
														)
													}
													className="px-4 py-2 bg-charcoal-gray text-white text-sm font-medium rounded-lg hover:bg-medium-gray transition-colors duration-200"
												>
													View Details
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center py-12 bg-white rounded-lg shadow-md border border-light-gray">
					<FaSearch className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-gray mb-4" />
					<p className="text-medium-gray text-lg sm:text-xl mb-2">
						{searchTerm
							? `No ${selectedRole.toLowerCase()}s found matching "${searchTerm}"`
							: `No ${selectedRole.toLowerCase()}s found`}
					</p>
					<p className="text-slate-gray text-sm sm:text-base">
						{searchTerm
							? "Try adjusting your search terms or filters"
							: `${selectedRole}s will appear here once added to the system`}
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
		</div>
	);
}

export default AdminUsers;
