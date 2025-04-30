import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	getMarksDetailsByALec,
	editMarks,
} from "../../../../services/operations/marks.service";
import { FaArrowLeftLong } from "react-icons/fa6";
import toast from "react-hot-toast";

function ViewMarks() {
	const { markLecture } = useSelector((state) => state.attendance);
	const { token } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [details, setDetails] = useState([]);
	const [totalMarks, setTotalMarks] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchMarksDetails = async () => {
			try {
				if (markLecture?._id) {
					const response = await getMarksDetailsByALec(
						markLecture._id,
						token
					);
					if (response) {
						// console.log(response);
						setDetails(response);
						setTotalMarks(response[0]?.totalMarks || "");
					}
				}
			} catch (error) {
				console.error("Error fetching marks details:", error);
			}
		};

		fetchMarksDetails();
	}, [markLecture, token]);

	const handleMarksChange = (studentId, value) => {
		setDetails((prevDetails) =>
			prevDetails.map((item) =>
				item.student._id === studentId
					? { ...item, marks: value }
					: item
			)
		);
	};

	const handleDescriptionChange = (studentId, value) => {
		setDetails((prevDetails) =>
			prevDetails.map((item) =>
				item.student._id === studentId
					? { ...item, description: value }
					: item
			)
		);
	};

	const handleSubmitMarks = async () => {
		if (!markLecture?._id) {
			toast.error("Lecture ID is missing");
			return;
		}

		setIsSubmitting(true);
		const toastId = toast.loading("Updating marks...");
		
		try {
			for (const item of details) {
				if (!item.student?._id) {
					toast.error("Student ID is missing");
					continue;
				}

				await editMarks(
					markLecture._id,
					item.student._id,
					item.marks || 0,
					totalMarks || 0,
					item.description || "",
					token
				);
			}
			
			toast.success("Marks updated successfully");
			navigate("/dashboard/admin-marks");
		} catch (error) {
			console.error("Error updating marks:", error);
			toast.error(error.response?.data?.message || "Failed to update marks");
		} finally {
			setIsSubmitting(false);
			toast.dismiss(toastId);
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
								).toLocaleDateString()}
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
				<form>
					<label>
						<p className="mb-1 text-lg ">Total Marks</p>
						<input
							type="text"
							value={totalMarks}
							onChange={(e) =>
								setTotalMarks(e.target.value)
							}
							className="w-full border border-charcoal-gray px-3 py-2 rounded-md "
						/>
					</label>
					<div className=" py-7 ">
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
									{details.map((item) => (
										<tr
											key={item?.student?._id}
											className="border-b border-richblack-700"
										>
											<td className="py-3 px-4 text-richblack-5">
												{
													item?.student
														?.name
												}
											</td>
											<td className="py-3 px-4">
												<input
													type="number"
													value={
														item?.marks
													}
													onChange={(
														e
													) =>
														handleMarksChange(
															item
																.student
																._id,
															e
																.target
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
														item?.description
													}
													onChange={(
														e
													) =>
														handleDescriptionChange(
															item
																.student
																._id,
															e
																.target
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
									? "Updating..."
									: "Update Marks"}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ViewMarks;
