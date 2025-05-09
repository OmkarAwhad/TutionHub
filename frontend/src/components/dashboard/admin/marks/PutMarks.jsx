import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studsPresentForALec } from "../../../../services/operations/attendance.service";
import { markStudentMarks } from "../../../../services/operations/marks.service";
import {
	setMarkLecture,
	setTotalMarks,
	setStudentMarks,
	clearMarks,
} from "../../../../slices/marks.slice";
import toast from "react-hot-toast";

function PutMarks() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [studentList, setStudentList] = useState([]);
	const [totalMarks, setTotalMarksInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { token } = useSelector((state) => state.auth);
	const { markLecture } = useSelector((state) => state.attendance);
	const { studentMarks } = useSelector((state) => state.marks);

	const fetchStudentsList = async () => {
		try {
			const lectureId = markLecture._id;
			const response = await dispatch(
				studsPresentForALec(lectureId, token)
			);
			if (response) {
				// console.log("Fetched students list:", response);
				setStudentList(response);
			}
		} catch (error) {
			console.log("Error in fetching students");
		}
	};

	useEffect(() => {
		fetchStudentsList();
		dispatch(setMarkLecture(markLecture));
		return () => {
			dispatch(clearMarks());
		};
	}, []);

	const handleMarksChange = (studentId, value) => {
		const marksValue = value === "" ? 0 : Number(value);
		dispatch(
			setStudentMarks({
				studentId,
				marks: marksValue,
				description: studentMarks[studentId]?.description || "",
			})
		);
	};

	const handleDescriptionChange = (studentId, value) => {
		dispatch(
			setStudentMarks({
				studentId,
				marks: studentMarks[studentId]?.marks || 0,
				description: value,
			})
		);
	};

	// useEffect(() => {
	// 	console.log("Current studentMarks state:", studentMarks);
	// 	console.log("Student list:", studentList);
	// }, [studentMarks, studentList]);

	const handleSubmitMarks = async () => {
		setIsSubmitting(true);
		try {
			// Validate marks for each student
			const invalidMarks = studentList.some((item) => {
				const studentId = item?.student?._id;
				const studentMarksValue = studentMarks[studentId]?.marks;
				// console.log("Validating marks for student:", studentId, "Marks:", studentMarksValue);
				return (
					studentMarksValue !== null &&
					studentMarksValue !== undefined &&
					studentMarksValue > totalMarks
				);
			});

			if (invalidMarks) {
				toast.error("Marks cannot be greater than total marks");
				setIsSubmitting(false);
				return;
			}

			// console.log("Submitting marks with state:", studentMarks);
			// console.log("Student list for submission:", studentList);

			const results = await Promise.all(
				studentList.map(async (item) => {
					try {
						const studentId = item?.student?._id;
						// console.log("Processing student:", studentId, "with marks:", studentMarks[studentId]);
						
						const result = await dispatch(
							markStudentMarks(
								studentId,
								markLecture._id,
								studentMarks[studentId]?.marks || 0,
								totalMarks,
								studentMarks[studentId]?.description || "",
								token
							)
						);
						return result;
					} catch (error) {
						console.error(
							`Error marking marks for student ${item?.student?._id}:`,
							error
						);
						return false;
					}
				})
			);

			const allSuccessful = results.every((result) => result);
			if (allSuccessful) {
				toast.success("Marks marked successfully");
				navigate("/dashboard/admin-marks");
			} else {
				toast.error("Failed to mark some students' marks");
			}
		} catch (error) {
			console.error("Error submitting marks:", error);
			toast.error("Failed to submit marks");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-richblack-5">
					Mark Marks
				</h3>
				<button
					onClick={() => navigate("/dashboard/admin-marks")}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>

			{markLecture && (
				<div className="bg-richblack-800 p-6 rounded-xl shadow-lg mb-8">
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-2xl font-bold text-richblack-5 mb-2">
								{markLecture.subject?.name}
							</h2>
							<p className="text-richblack-200">
								{new Date(
									markLecture.date
								).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                     })}
							</p>
						</div>
						<div className="text-right">
							<p className="text-richblack-200">
								<span className="text-medium-gray">
									Time:{" "}
								</span>
								{markLecture.time}
							</p>
							<p className="text-richblack-200">
								<span className="text-medium-gray">
									Tutor:{" "}
								</span>
								{markLecture.tutor?.name}
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="bg-richblack-800 p-6 rounded-xl shadow-lg mb-8">
				<label className="text-richblack-5 mb-2 block">
					Total Marks
				</label>
				<input
					type="number"
					value={totalMarks}
					onChange={(e) => {
						setTotalMarksInput(e.target.value);
						dispatch(setTotalMarks(e.target.value));
					}}
					className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-lg border border-charcoal-gray outline-none focus:border-yellow-50"
					placeholder="Enter total marks"
				/>
			</div>

			<div className="bg-richblack-800 rounded-xl shadow-lg overflow-hidden">
				<div className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b bg-gray-200 rounded-2xl border-richblack-700">
									<th className="py-3 px-4 text-left text-richblack-200">
										Student Name
									</th>
									<th className="py-3 px-4 text-left text-richblack-200">
										Marks
									</th>
									<th className="py-3 px-4 text-left text-richblack-200">
										Description
									</th>
								</tr>
							</thead>
							<tbody>
								{studentList.map((item) => (
									<tr
										key={item?.student?._id}
										className="border-b border-richblack-700"
									>
										<td className="py-3 px-4 text-richblack-5">
											{item?.student?.name}
										</td>
										<td className="py-3 px-4">
											<input
												type="number"
												value={
													studentMarks[
														item
															?.student
															?._id
													]?.marks || ""
												}
												onChange={(e) =>
													handleMarksChange(
														item
															?.student
															?._id,
														e.target
															.value
													)
												}
												className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-lg border border-charcoal-gray outline-none focus:border-yellow-50 scroll-auto "
												placeholder="Enter marks"
											/>
										</td>
										<td className="py-3 px-4">
											<input
												type="text"
												value={
													studentMarks[
														item
															?.student
															?._id
													]
														?.description ||
													""
												}
												onChange={(e) =>
													handleDescriptionChange(
														item
															?.student
															?._id,
														e.target
															.value
													)
												}
												className="w-full bg-richblack-700 text-richblack-5 p-2 rounded-lg border border-charcoal-gray outline-none focus:border-yellow-50"
												placeholder="Enter description (Optional)"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-6 flex justify-end">
						<button
							onClick={handleSubmitMarks}
							disabled={isSubmitting}
							className={`px-4 py-2 rounded-lg font-medium text-white ${
								isSubmitting
									? "bg-richblack-700 text-richblack-300 cursor-not-allowed"
									: "bg-medium-gray text-richblack-900 hover:bg-charcoal-gray"
							} transition-all duration-200`}
						>
							{isSubmitting
								? "Submitting..."
								: "Submit Marks"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PutMarks;
