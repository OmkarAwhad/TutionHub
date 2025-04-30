import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import PastDateCard from "../attendance/PastDateCard";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function MarkMarks() {
	const [testLectures, setTestLectures] = useState([]);

	const { token } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const fetchTestLec = async () => {
		try {
			let response = await dispatch(getAllLectures(token));
			if (response) {
				// Filter lectures to exclude those where marks are already marked
				response = response.filter(
					(lect) =>
						lect.description !== "Lecture" &&
						lect.marksMarked === false // Ensure only unmarked lectures are shown
				);
				setTestLectures(response);
			}
		} catch (error) {
			console.error("Error fetching lectures:", error);
		}
	};

	useEffect(() => {
		fetchTestLec();
	}, []);

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-2xl font-semibold text-richblack-5">
					Marks
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
				{testLectures.map((item) => (
					<PastDateCard
						key={item._id}
						lecture={item}
						mode={"marks"}
					/>
				))}
			</div>
		</div>
	);
}

export default MarkMarks;
