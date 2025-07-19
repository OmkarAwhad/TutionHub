import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersList } from "../../../../services/operations/users.service";
import { assignSubjectToStudent } from "../../../../services/operations/subject.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AssignSubTutors() {
	const [tutors, setTutors] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState(""); // 👈 Add search state
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	useEffect(() => {
		fetchtutors();
		fetchSubjects();
	}, []);

	const fetchtutors = async () => {
		try {
			let result = await dispatch(getAllUsersList(token));
			if (result) {
				result = result.filter((user) => user.role === "Tutor");
				setTutors(result);
			}
		} catch (error) {
			console.error("Error fetching tutors:", error);
		}
	};

	const fetchSubjects = async () => {
		try {
			const result = await dispatch(getAllSubjects(token));
			if (result) {
				setSubjects(result);
				toast.success("Tutors list fetched successfully");
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubjectChange = async (userId, subjectId, isChecked) => {
		try {
			const result = await dispatch(
				assignSubjectToStudent(userId, subjectId, isChecked, token)
			);
			if (result) {
				fetchtutors();
			}
		} catch (error) {
			console.error("Error assigning subject:", error);
		}
	};

	// 👈 Filter tutors based on search term
	const filteredTutors = tutors.filter(
		(tutor) =>
			tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-3xl font-semibold text-richblack-5">
					Assign Subjects to Tutors
				</h3>
				<button
					onClick={() =>
						navigate(
							"/dashboard/admin-subjects/assign-subjects"
						)
					}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>

			{/* 👈 Beautiful Search Box */}
			<div className="mb-8">
				<div className="relative max-w-2xl mx-auto">
					<div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
						<FaSearch className="h-5 w-5 text-medium-gray" />
					</div>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search tutors by name or email..."
						className="block w-full pl-14 pr-6 py-4 text-lg bg-white border-2 border-light-gray rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-charcoal-gray/20 focus:border-charcoal-gray transition-all duration-300 hover:shadow-xl hover:border-medium-gray placeholder-medium-gray"
					/>
					{searchTerm && (
						<button
							onClick={() => setSearchTerm("")}
							className="absolute inset-y-0 right-0 pr-6 flex items-center text-medium-gray hover:text-charcoal-gray transition-colors duration-200"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
				{searchTerm && (
					<div className="mt-4 text-center">
						<span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-gray/10 text-charcoal-gray rounded-full text-sm font-medium">
							<FaSearch className="h-3 w-3" />
							Showing {filteredTutors.length} of{" "}
							{tutors.length} tutors
						</span>
					</div>
				)}
			</div>

			<div className="p-6 mt-10 bg-white rounded-lg shadow-xl shadow-slate-gray">
				<div className="relative">
					<div className="border border-gray-200 rounded-lg overflow-hidden">
						<div className="absolute left-0 top-0 w-[400px] bg-white ">
							<table className="w-full">
								<thead>
									<tr>
										<th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 w-[180px]">
											Tutor
										</th>
										<th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
											Email
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredTutors.map((tutor) => (
										<tr
											key={tutor._id}
											className="hover:bg-gray-50 "
										>
											<td className="px-6 py-[4.5%] whitespace-nowrap border-b border-gray-200 text-sm text-gray-900">
												{tutor.name}
											</td>
											<td className="px-6 py-[4.5%] whitespace-nowrap border-b border-gray-200 text-sm text-gray-600">
												{tutor.email}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="ml-[400px] overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr>
										{subjects.map((subject) => (
											<th
												key={subject._id}
												className="px-6 py-4 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 min-w-[150px]"
											>
												{subject.name}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filteredTutors.map((tutor) => (
										<tr
											key={tutor._id}
											className="hover:bg-gray-50"
										>
											{subjects.map(
												(subject) => (
													<td
														key={
															subject._id
														}
														className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-center"
													>
														<label className="inline-flex items-center justify-center cursor-pointer">
															<input
																type="checkbox"
																checked={tutor.subjects?.some(
																	(
																		s
																	) =>
																		s._id ===
																		subject._id
																)}
																onChange={(
																	e
																) =>
																	handleSubjectChange(
																		tutor._id,
																		subject._id,
																		e
																			.target
																			.checked
																	)
																}
																className="form-checkbox h-4 w-4 bg-charcoal-gray border-charcoal-gray text-charcoal-gray transition duration-150 ease-in-out focus:ring-charcoal-gray focus:ring-offset-0 focus:ring-2 focus:ring-opacity-50 checked:bg-charcoal-gray"
															/>
														</label>
													</td>
												)
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* 👈 No results message */}
				{searchTerm && filteredTutors.length === 0 && (
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-light-gray rounded-full mb-4">
							<FaSearch className="h-6 w-6 text-medium-gray" />
						</div>
						<p className="text-medium-gray text-xl mb-2">
							No tutors found matching "{searchTerm}"
						</p>
						<p className="text-slate-gray text-sm mb-4">
							Try adjusting your search terms or check the
							spelling
						</p>
						<button
							onClick={() => setSearchTerm("")}
							className="px-6 py-3 bg-charcoal-gray text-white rounded-xl hover:bg-medium-gray transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
						>
							Clear Search
						</button>
					</div>
				)}
			</div>
		</>
	);
}

export default AssignSubTutors;
