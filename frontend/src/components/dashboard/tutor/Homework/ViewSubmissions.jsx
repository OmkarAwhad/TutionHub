import React, { useEffect, useState } from "react";
import { getMyDetails } from "../../../../services/operations/users.service";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setSelectHomework } from "../../../../slices/homework.slice";

function ViewSubmissions() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [myHomework, setMyHomework] = useState([]);

	const fetchMyDetails = async () => {
		try {
			const response = await dispatch(getMyDetails(token));
			if (response) {
				console.log(response?.homework);
				setMyHomework(response.homework);
			}
		} catch (error) {
			toast.error("Error in fetching your details");
		}
	};

	useEffect(() => {
		fetchMyDetails();
	}, [dispatch, token]);

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">View Submissions</h1>
				<div
					onClick={() => navigate(-1)}
					className="flex cursor-pointer gap-2 text-charcoal-gray items-center"
				>
					<IoMdArrowRoundBack />
					Back
				</div>
			</div>
			<div className="p-8">
				{myHomework && myHomework.length === 0 ? (
					<div className="w-full flex items-center justify-center ">
						<p className="text-3xl text-medium-gray">
							No homework available
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myHomework &&
							myHomework.map((homework) => (
								<div
									key={homework._id}
									onClick={() => {
										dispatch(
											setSelectHomework(
												homework
											)
										);
										navigate(
											`/dashboard/tutor-homework/view-submissions/${homework._id}`
										);
									}}
									className="space-y-4 relative p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300 bg-richblack-800 hover:scale-103 cursor-pointer "
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-xl font-semibold text-richblack-5">
												{homework.title}
											</h3>
											<p className="text-medium-gray">
												{
													homework
														.subject
														.name
												}{" "}
												(
												{
													homework
														.subject
														.code
												}
												)
											</p>
										</div>
									</div>
									<div className="space-y-2">
										<p className="text-richblack-200">
											<span className="text-medium-gray">
												Uploaded:
											</span>{" "}
											{new Date(
												homework.createdAt
											).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                     })}
										</p>
										<p className="text-richblack-200">
											<span className="text-medium-gray">
												Due Date:
											</span>{" "}
											{new Date(
												homework.dueDate
											).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                     })}
										</p>
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
}

export default ViewSubmissions;
