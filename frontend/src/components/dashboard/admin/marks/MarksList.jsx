import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { FaArrowLeftLong } from "react-icons/fa6";
import PastDateCard from "../attendance/PastDateCard";

function MarksList() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [lecturesList, setLecturesList] = useState([]);

	const fetchMarkedLecs = async () => {
		try {
			let response = await dispatch(getAllLectures(token));
			if (response) {
				response = response.filter(
					(lec) =>
						lec.description !== "Lecture" &&
						lec.marksMarked === true
				);
			}
			// console.log(response)
			setLecturesList(response);
			// console.log(lecturesList);
		} catch (error) {
			console.error("Error fetching lectures:", error);
		}
	};

	useEffect(() => {
		fetchMarkedLecs();
	}, []);

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-richblack-5">
					View Marks
				</h3>
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10 ">
				{lecturesList && lecturesList.length > 0 ? (
					lecturesList.map((lect) => (
						<PastDateCard
							key={lect._id}
							lecture={lect}
							mode={"view-marks"}
						/>
					))
				) : (
					<div>
						<p className="text-richblack-200">
							No marked lectures available.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default MarksList;
