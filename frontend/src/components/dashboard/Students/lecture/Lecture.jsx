import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-hot-toast";
import LectureTable from "./LectureTable";
import { getLecturesByDate } from "../../../../services/operations/lecture.service";

function Lecture() {
	const { token } = useSelector((state) => state.auth);
	const [lectList, setLectList] = useState({});
	const [weekStart, setWeekStart] = useState("");
	const [weekEnd, setWeekEnd] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());

	// Initialize with current date
	useEffect(() => {
		fetchLecturesOfWeek();
	}, []);

	// Function to fetch lectures for the current week
	const fetchLecturesOfWeek = async () => {
		setLoading(true);
		try {
			// Format date as YYYY-MM-DD
			const formattedDate = currentDate.toISOString().split('T')[0];
			const response = await getLecturesByDate(token, formattedDate, true);

			if (response) {
				setLectList(response.lectures || {});
				setWeekStart(response.weekStart || "");
				setWeekEnd(response.weekEnd || "");
			}
		} catch (error) {
			console.error("Failed to fetch lectures of the week:", error);
			toast.error("Failed to load weekly lectures");
		} finally {
			setLoading(false);
		}
	};

	// Handle navigation between weeks
	const handleWeekShift = (direction) => {
		setLoading(true);
		// Create new date by shifting the current date
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + (direction * 7));
		setCurrentDate(newDate);

		// Fetch lectures for the new date
		const formattedDate = newDate.toISOString().split('T')[0];
		getLecturesByDate(token, formattedDate, true)
			.then(response => {
				if (response) {
					setLectList(response.lectures || {});
					setWeekStart(response.weekStart || "");
					setWeekEnd(response.weekEnd || "");
				}
			})
			.catch(error => {
				console.error("Failed to fetch lectures by date:", error);
				toast.error("Failed to load lectures for the selected week");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="py-4">
			<div className="mb-10 flex items-center justify-between pr-10">
				<h1 className="text-3xl font-bold text-richblack-5">Schedule</h1>
				<div className="flex gap-1">
					<button
						onClick={() => handleWeekShift(-1)}
						className="p-2 text-2xl bg-slate-gray text-white rounded-md cursor-pointer disabled:opacity-50"
						disabled={loading}
						aria-label="Previous week"
					>
						<IoIosArrowBack />
					</button>
					<button
						onClick={() => handleWeekShift(1)}
						className="p-2 text-2xl bg-slate-gray text-white rounded-md cursor-pointer disabled:opacity-50"
						disabled={loading}
						aria-label="Next week"
					>
						<IoIosArrowForward />
					</button>
				</div>
			</div>

			{loading ? (
				<div className="text-richblack-200 text-center py-4">
					Loading lectures...
				</div>
			) : (
				<LectureTable
					weekStart={weekStart}
					weekEnd={weekEnd}
					lectList={lectList}
				/>
			)}
		</div>
	);
}

export default Lecture;