import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clearSelectHomework } from "../../../../slices/homework.slice";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getDownloadUrl } from "../../../../utils/fileUtils";
import { FaDownload } from "react-icons/fa6";
import { getSubmissions } from "../../../../services/operations/homework.service";
import toast from "react-hot-toast";

function SubmissionsOfAHW() {
	const { homeworkId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);
	const { selectHomework } = useSelector((state) => state.homework);
	const [submitted, setSubmitted] = useState([]);
	const [notSubmitted, setNotSubmitted] = useState([]);

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				let response = await dispatch(
					getSubmissions(homeworkId, token)
				);
				if (response) {
					const filteredSubmissions = response.submissions.filter(submission => {
						if (!selectHomework?.standard?._id) return true; // Show all if no standard set
						return submission.student.profile?.standard?._id === selectHomework.standard._id;
					});

					// 👈 Filter not submitted students based on homework's standard
					const filteredNotSubmitted = response.notSubmitted.filter(student => {
						if (!selectHomework?.standard?._id) return true; // Show all if no standard set
						return student.profile?.standard?._id === selectHomework.standard._id;
					});

					setSubmitted(filteredSubmissions);
					setNotSubmitted(filteredNotSubmitted);
				}
			} catch (error) {
				toast.error("Error in fetching submissions ");
				console.log("Error in fetching submissions ");
			}
		};
		fetchSubmissions();
		// console.log(selectHomework);
		// return () => {
		//    dispatch(clearSelectHomework());
		// };
	}, [dispatch, token]);

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">{selectHomework?.title}</h1>
				<div
					onClick={() => navigate(-1)}
					className="flex cursor-pointer gap-2 text-charcoal-gray items-center"
				>
					<IoMdArrowRoundBack />
					Back
				</div>
			</div>
			<div className="p-8">
				<div className="space-y-2 text-xl relative p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300  ">
					<div className="space-y-2">
						<p className="text-medium-gray">
							Subject :{" "}
							<span className="text-charcoal-gray">
								{selectHomework?.subject?.name} (
								{selectHomework?.subject?.code})
							</span>
						</p>
						<p className="text-richblack-200">
							<span className="text-medium-gray">
								Standard:
							</span>{" "}
							{selectHomework?.standard?.standardName}
						</p>
						<p className="text-medium-gray">
							Uploaded At :{" "}
							<span className="text-charcoal-gray text-lg">
								{new Date(
									selectHomework?.createdAt
								).toLocaleDateString("en-GB", {
									day: "2-digit",
									month: "2-digit",
									year: "2-digit",
								})}
							</span>
						</p>
						<p className="text-medium-gray">
							Due Date :{" "}
							<span className="text-charcoal-gray text-lg">
								{new Date(
									selectHomework?.dueDate
								).toLocaleDateString("en-GB", {
									day: "2-digit",
									month: "2-digit",
									year: "2-digit",
								})}
							</span>
						</p>
						{selectHomework.description && (
							<p className="text-medium-gray">
								Description :{" "}
								<span className="text-charcoal-gray">
									{selectHomework.description}
								</span>
							</p>
						)}
					</div>
					{selectHomework.fileUrl && (
						<div className="pt-4 flex justify-end relative group">
							<span className="text-xs bg-gray-200 px-2 py-1 rounded-md absolute bottom-14 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-[-20px] -right-5 z-10 transition-all duration-300">
								Download File
							</span>
							<a
								href={getDownloadUrl(
									selectHomework.fileUrl
								)}
								download
								className="bg-medium-gray text-white cursor-pointer hover:bg-charcoal-gray border-2 p-5 rounded-full text-lg transition-all duration-150 absolute bottom-8"
								title={`Download ${selectHomework.title}`}
							>
								<FaDownload />
							</a>
						</div>
					)}
				</div>
				<div className=" space-y-2 text-xl relative p-6 rounded-xl shadow shadow-medium-gray hover:shadow-xl transition-all duration-300">
					<table className="w-full pt-10">
						<thead>
							<tr className="border-b bg-gray-200 rounded-2xl border-richblack-700">
								<th className="py-3 px-4 text-base text-center text-richblack-200">
									Student Name
								</th>
								<th className="py-3 px-4 text-base text-center text-richblack-200">
									Submitted Or Not
								</th>
								<th className="py-3 px-4 text-base text-center text-richblack-200">
									Time
								</th>
								<th className="py-3 px-4 text-base text-center text-richblack-200">
									Submission
								</th>
							</tr>
						</thead>
						<tbody>
							{submitted &&
								submitted.map((stud) => (
									<tr key={stud._id}>
										<th className="py-3 px-4 text-base text-center text-medium-gray">
											{stud.student.name}
										</th>
										<th className="py-3 px-4 text-base text-center text-medium-gray">
											Submitted
										</th>
										<th
											className={`py-3 px-4 text-base text-center ${!stud.isLate
													? "text-green-500"
													: "text-red-500"
												} `}
										>
											{!stud.isLate
												? "On time"
												: "Late"}
										</th>
										<th className="py-3 px-4 text-base text-center text-black  ">
											<a
												href={getDownloadUrl(
													stud.fileUrl
												)}
												download
												className=""
												title={`Download homework`}
											>
												<FaDownload className="mx-auto cursor-pointer" />
											</a>
										</th>
									</tr>
								))}
							{notSubmitted &&
								notSubmitted.map((stud) => (
									<tr key={stud._id}>
										<th className="py-3 px-4 text-base text-center text-medium-gray">
											{stud.name}
										</th>
										<th className="py-3 px-4 text-base text-center text-medium-gray">
											Not Submitted
										</th>
										<th
											className={`py-3 px-4 text-base text-center `}
										>
											-
										</th>
										<th className="py-3 px-4 text-base text-center text-gray-500  ">
											<FaDownload className="mx-auto cursor-not-allowed" />
										</th>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default SubmissionsOfAHW;
