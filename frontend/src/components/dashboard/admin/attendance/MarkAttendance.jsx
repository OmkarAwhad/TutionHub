import React, { useEffect, useState } from "react";
import { getAllLectures } from "../../../../services/operations/lecture.service";
import { getLecturesWithoutAttendance } from "../../../../services/operations/attendance.service";
import { useDispatch, useSelector } from "react-redux";
import PastDateCard from "./PastDateCard";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function MarkAttendance() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [filteredLectures, setFilteredLectures] = useState([]);
	const [loading, setLoading] = useState(true);

	const refreshLectures = async () => {
		setLoading(true);
		try {
			const response = await dispatch(getLecturesWithoutAttendance(token));
			// console.log("Lectures without attendance:", response);
			setFilteredLectures(response);
		} catch (error) {
			console.error("Failed to fetch lectures:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshLectures();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-50"></div>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-richblack-5">
					All Lectures
				</h1>
				<button
					onClick={() => navigate("/dashboard/admin-attendance")}
					className="flex items-center gap-2 text-richblack-200 cursor-pointer hover:text-richblack-5 transition-all duration-200"
				>
					<IoArrowBack className="text-lg" />
					Back
				</button>
			</div>
			<div>
				{filteredLectures.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredLectures.map((lecture) => (
							<PastDateCard
								key={lecture._id}
								lecture={lecture}
								onAttendanceMarked={refreshLectures}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<p className="text-2xl text-richblack-200">
							No lectures available for attendance marking
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default MarkAttendance;
