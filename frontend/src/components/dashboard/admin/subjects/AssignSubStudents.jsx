import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentsList } from "../../../../services/operations/users.service";
import { assignSubjectToStudent } from "../../../../services/operations/subject.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function AssignSubStudents() {
	const [students, setStudents] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	useEffect(() => {
		fetchStudents();
		fetchSubjects();
	}, []);

	const fetchStudents = async () => {
		try {
			const result = await dispatch(getAllStudentsList(token));
			if (result) {
				setStudents(result);
			}
		} catch (error) {
			console.error("Error fetching students:", error);
		}
	};

	const fetchSubjects = async () => {
		try {
			const result = await dispatch(getAllSubjects(token));
			if (result) {
				setSubjects(result);
				toast.success("Students list fetched successfully");
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubjectChange = async (studentId, subjectId, isChecked) => {
		try {
			const result = await dispatch(
				assignSubjectToStudent(
					studentId,
					subjectId,
					isChecked,
					token
				)
			);
			if (result) {
				fetchStudents();
			}
		} catch (error) {
			console.error("Error assigning subject:", error);
		}
	};

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
					Assign Subjects to Students
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
			<div className="p-6 mt-10 bg-white rounded-lg shadow-2xl">
				<div className="relative">
					{/* Table container with border */}
					<div className="border border-gray-200 rounded-lg overflow-hidden">
						{/* Fixed columns container */}
						<div className="absolute left-0 top-0 w-[400px] bg-white ">
							<table className="w-full">
								<thead>
									<tr>
										<th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 w-[180px]">
											Student
										</th>
										<th className="px-6 py-4 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
											Email
										</th>
									</tr>
								</thead>
								<tbody>
									{students.map((student) => (
										<tr
											key={student._id}
											className="hover:bg-gray-50 "
										>
											<td className="px-6 py-[4.5%] whitespace-nowrap border-b border-gray-200 text-sm text-gray-900">
												{student.name}
											</td>
											<td className="px-6 py-[4.5%] whitespace-nowrap border-b border-gray-200 text-sm text-gray-600">
												{student.email}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Scrollable subjects container */}
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
									{students.map((student) => (
										<tr
											key={student._id}
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
																checked={student.subjects?.includes(
																	subject._id
																)}
																onChange={(
																	e
																) =>
																	handleSubjectChange(
																		student._id,
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
			</div>
		</>
	);
}

export default AssignSubStudents;
