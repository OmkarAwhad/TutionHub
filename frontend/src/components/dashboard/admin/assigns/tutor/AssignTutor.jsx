import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	assignTutor,
	getAllUsersList,
} from "../../../../../services/operations/users.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong, FaGraduationCap } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AssignTutor() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	useEffect(() => {
		fetchUsers();
		// eslint-disable-next-line
	}, []);

	const fetchUsers = async () => {
		try {
			const result = await dispatch(getAllUsersList(token));
			if (result) setUsers(result);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	// Toggle role: Tutor <-> Student
	const handleToggleTutor = async (tutorId) => {
		try {
			const result = await dispatch(assignTutor(tutorId, token));
			if (result) {
				toast.success("Role updated successfully");
				fetchUsers();
			}
		} catch (error) {
			toast.error("Failed to assign tutor");
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Loader
	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
				<div className="flex items-center gap-3">
					<FaGraduationCap className="text-primary text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">
						Assign Tutors
					</h1>
				</div>
				<button
					onClick={() => navigate("/dashboard/assigns")}
					className="flex items-center gap-2 px-3 py-2 text-base text-gray-500 hover:text-primary transition-colors rounded focus:outline-none"
				>
					<FaArrowLeftLong className="text-lg" />
					<span>Back</span>
				</button>
			</div>

			{/* Search Box */}
			<div className="bg-white p-5 rounded-xl shadow border border-gray-200 mb-6">
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search users by name or email..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-gray-700
                       focus:outline-none focus:border-primary transition"
					/>
				</div>
				{searchTerm && (
					<div className="mt-2">
						<p className="text-sm text-gray-500">
							Showing {filteredUsers.length} of{" "}
							{users.length} users
						</p>
					</div>
				)}
			</div>

			{/* Users List */}
			<div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
				{/* Mobile Cards */}
				<div className="block lg:hidden p-4">
					<h3 className="text-xl font-semibold text-charcoal-gray mb-2">
						Users
						{searchTerm && (
							<span className="text-sm font-normal text-gray-500 ml-2">
								({filteredUsers.length} results)
							</span>
						)}
					</h3>
					<div className="space-y-4">
						{filteredUsers.map((user) => (
							<div
								key={user._id}
								className="bg-gray-50 border border-gray-100 p-4 rounded-lg"
							>
								<h4 className="font-medium text-charcoal-gray">
									{user.name}
								</h4>
								<p className="text-sm text-gray-500">
									{user.email}
								</p>
								<div className="flex items-center justify-between mt-3">
									<span className="text-sm text-gray-600">
										Assign Tutor
									</span>
									<input
										type="checkbox"
										name={`user-${user._id}`}
										checked={
											user.role === "Tutor"
										}
										onChange={() =>
											handleToggleTutor(
												user._id
											)
										}
										className="h-5 w-5 accent-primary cursor-pointer"
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Desktop Table */}
				<div className="hidden lg:block">
					<div className="p-4 border-b border-gray-100">
						<h3 className="text-xl font-semibold text-charcoal-gray">
							Users
							{searchTerm && (
								<span className="text-sm font-normal text-gray-500 ml-2">
									({filteredUsers.length} results)
								</span>
							)}
						</h3>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full table-fixed">
							<thead>
								<tr className="bg-gray-50">
									<th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-[220px]">
										Name
									</th>
									<th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase w-[270px]">
										Email
									</th>
									<th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase w-[160px]">
										Tutor
									</th>
								</tr>
							</thead>
							<tbody>
								{filteredUsers.map((user, idx) => (
									<tr
										key={user._id}
										className={
											idx % 2 === 0
												? "bg-white"
												: "bg-gray-50"
										}
									>
										<td className="px-6 py-4 text-sm font-medium text-charcoal-gray">
											<span
												title={user.name}
												className="truncate block"
											>
												{user.name}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											<span
												title={user.email}
												className="truncate block"
											>
												{user.email}
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<input
												type="checkbox"
												name={`user-${user._id}`}
												checked={
													user.role ===
													"Tutor"
												}
												onChange={() =>
													handleToggleTutor(
														user._id
													)
												}
												className="h-5 w-5 accent-primary cursor-pointer"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Empty/No results view */}
				{filteredUsers.length === 0 && (
					<div className="text-center py-12">
						<FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
						<p className="text-gray-500 text-lg mb-2">
							{searchTerm
								? `No users found matching "${searchTerm}"`
								: "No users found"}
						</p>
						<p className="text-gray-400 text-sm">
							{searchTerm
								? "Try adjusting your search terms"
								: "Users will appear here once added"}
						</p>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm("")}
								className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
							>
								Clear Search
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default AssignTutor;
