import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLecturesOfWeek } from "../../../../services/operations/lecture.service";
import LectureTable from "./LectureTable";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function Lecture() {
	const { token } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [lectList, setLectList] = useState({});
	const [weekStart, setWeekStart] = useState("");
	const [weekEnd, setWeekEnd] = useState("");

	const fetchLecturesOfWeek = async () => {
		try {
			const response = await getLecturesOfWeek(token);
			if (response) {
				console.log(response);
				setLectList(response.lectures);
				setWeekStart(response.weekStart);
				setWeekEnd(response.weekEnd);
			}
		} catch (error) {
			console.error("Failed to fetch lectures of the week:", error);
		}
	};

	useEffect(() => {
		fetchLecturesOfWeek();
	}, []);

	return (
		<div className="py-4">
			<div className="mb-10 flex items-center justify-between pr-10 ">
				<h1 className="text-3xl font-bold text-richblack-5">
					Schedule
				</h1>
				<div className="flex gap-1">
					<button className=" p-2 text-2xl bg-slate-gray text-white rounded-md cursor-pointer ">
						<IoIosArrowBack />
					</button>
					<button className=" p-2 text-2xl bg-slate-gray text-white rounded-md cursor-pointer ">
						<IoIosArrowForward />
					</button>
				</div>
			</div>
			<LectureTable
				weekStart={weekStart}
				weekEnd={weekEnd}
				lectList={lectList}
			/>
		</div>
	);
}

export default Lecture;
