import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { subjectsOfAStudent } from "../../../../services/operations/subject.service";
import { viewAttendanceOfAStud } from "../../../../services/operations/attendance.service";

function Attendance() {
	const { token } = useSelector((state) => state.auth);

	const [subjects, setSubjects] = useState(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const result = await dispatch(subjectsOfAStudent(token));
				// console.log("result:", result);
				setSubjects(result);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};
		fetchSubjects();
		dispatch(viewAttendanceOfAStud(token));
	}, [dispatch, token]);

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[20vh] p-4 transition-all duration-300 hover:shadow-xl border border-slate-gray">
			<IoIosArrowBack onClick={() => navigate(-1)} />
			<div>
				{subjects && subjects.length > 0 ? (
					subjects.map((item) => (
						<div key={item._id}>{item.name}</div>
					))
				) : (
					<p>No subjects available</p>
				)}
			</div>
		</div>
	);
}

export default Attendance;
