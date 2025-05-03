import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { subjectsOfAStudent } from "../../../../services/operations/subject.service";
import { viewAttendanceOfAStud } from "../../../../services/operations/attendance.service";
import { FaArrowLeftLong } from "react-icons/fa6";
import AttendChart from "./AttendChart";
import AttendForSub from "./AttendForSub";

function Attendance() {
	const { token } = useSelector((state) => state.auth);

	const [subjects, setSubjects] = useState(null);
	const [studAttendLec, setStudAttendLec] = useState(null);
	const [studAttendStats, setStudAttendStats] = useState(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchStudentAttend = async () => {
			try {
				const response = await dispatch(
					viewAttendanceOfAStud(token)
				);
				if (response) {
					// console.log(response)
					setStudAttendLec(response.attendanceDetails);
					setStudAttendStats(response.statistics);
				}
			} catch (error) {
				console.error("Error fetching attendance:", error);
			}
		};
		fetchStudentAttend();
	}, [dispatch, token]);

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const result = await dispatch(subjectsOfAStudent(token));
				// console.log("result:", result);
				if (result) {
					setSubjects(result);
				}
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};
		fetchSubjects();
		// dispatch(viewAttendanceOfAStud(token));
	}, [dispatch, token]);

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
			<div className="bg-white rounded-xl shadow-xl  overflow-hidden min-h-[20vh] p-4 transition-all duration-300  ">
				<AttendForSub subjects={subjects} />
			</div>
			<div className="bg-white rounded-xl mt-5 shadow-xl  overflow-hidden min-h-[20vh] p-4 transition-all duration-300  ">
				<AttendChart studAttendStats={studAttendStats} />
			</div>
		</div>
	);
}

export default Attendance;
