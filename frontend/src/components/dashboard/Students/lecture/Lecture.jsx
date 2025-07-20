import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCalendarWeek } from "react-icons/fa6";
import { FaChalkboardTeacher } from "react-icons/fa";
import { toast } from "react-hot-toast";
import LectureTable from "./LectureTable";
import { getMyLecturesByDate } from "../../../../services/operations/lecture.service";

function Lecture() {
	const { token } = useSelector((state) => state.auth);
	const [lectList, setLectList] = useState({});
	const [weekStart, setWeekStart] = useState("");
	const [weekEnd, setWeekEnd] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		fetchLecturesOfWeek();
	}, []);

	const fetchLecturesOfWeek = async () => {
		setLoading(true);
		try {
			const formattedDate = currentDate.toISOString().split('T')[0];
			const response = await getMyLecturesByDate(token, formattedDate, true);

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

	const handleWeekShift = (direction) => {
		setLoading(true);
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + (direction * 7));
		setCurrentDate(newDate);

		const formattedDate = newDate.toISOString().split('T')[0];
		getMyLecturesByDate(token, formattedDate, true)
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
		<div className="p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<FaChalkboardTeacher className="text-charcoal-gray text-2xl" />
					<h1 className="text-3xl font-bold text-charcoal-gray">Weekly Schedule</h1>
				</div>

				{/* Navigation Controls */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-medium-gray">
						<FaCalendarWeek className="text-lg" />
						<span className="text-sm font-medium">Navigate Weeks</span>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => handleWeekShift(-1)}
							className="p-3 bg-slate-gray text-white rounded-xl cursor-pointer hover:bg-medium-gray transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={loading}
							aria-label="Previous week"
						>
							<IoIosArrowBack className="text-lg" />
						</button>
						<button
							onClick={() => handleWeekShift(1)}
							className="p-3 bg-slate-gray text-white rounded-xl cursor-pointer hover:bg-medium-gray transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={loading}
							aria-label="Next week"
						>
							<IoIosArrowForward className="text-lg" />
						</button>
					</div>
				</div>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="text-center py-8">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-charcoal-gray mx-auto mb-4"></div>
					<p className="text-medium-gray">Loading lectures...</p>
				</div>
			)}

			{/* Lecture Table */}
			{!loading && (
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
