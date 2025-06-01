import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-hot-toast";
import LectureTable from "../../Students/lecture/LectureTable";
import { getTutorLecturesByDate } from "../../../../services/operations/lecture.service";

function TutorLecture() {
	const { token } = useSelector((state) => state.auth);
	const [lectList, setLectList] = useState({});
	const [weekStart, setWeekStart] = useState("");
	const [weekEnd, setWeekEnd] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		fetchLecturesOfWeek();
		// eslint-disable-next-line
	}, []);

	const fetchLecturesOfWeek = async () => {
		setLoading(true);
		try {
			const formattedDate = currentDate.toISOString().split('T')[0];
			const response = await getTutorLecturesByDate(token, formattedDate, true);

			if (response) {
				setLectList(response.lectures || {});
				setWeekStart(response.weekStart || "");
				setWeekEnd(response.weekEnd || "");
			}
		} catch (error) {
			console.error("Failed to fetch lectures of the week:", error);
			toast.error("Failed to load your weekly lectures");
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
		getTutorLecturesByDate(token, formattedDate, true)
			.then(response => {
				if (response) {
					setLectList(response.lectures || {});
					setWeekStart(response.weekStart || "");
					setWeekEnd(response.weekEnd || "");
				}
			})
			.catch(error => {
				console.error("Failed to fetch lectures by date:", error);
				toast.error("Failed to load your lectures for the selected week");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="py-4">
			<div className="mb-10 flex items-center justify-between pr-10">
				<h1 className="text-3xl font-bold text-richblack-5">Your Lectures</h1>
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
					Loading your lectures...
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

export default TutorLecture;