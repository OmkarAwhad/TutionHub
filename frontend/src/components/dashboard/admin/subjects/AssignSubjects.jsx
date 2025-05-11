import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentsList } from "../../../../services/operations/users.service";
import { assignSubjectToStudent } from "../../../../services/operations/subject.service";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function AssignSubjects() {
	const [students, setStudents] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useSelector((state) => state.auth);

	useEffect(() => {
		fetchStudents();
		fetchSubjects();
	}, []);

	const fetchStudents = async () => {
		try {
			const result = await dispatch(getAllStudentsList(token));
			if (result) {
				setStudents(result);
			}
		} catch (error) {
			console.error("Error fetching students:", error);
		}
	};

	const fetchSubjects = async () => {
		try {
			const result = await dispatch(getAllSubjects(token));
			if (result) {
				setSubjects(result);
				toast.success("Students list fetched successfully");
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubjectChange = async (studentId, subjectId, isChecked) => {
		try {
			const result = await dispatch(
				assignSubjectToStudent(
					studentId,
					subjectId,
					isChecked,
					token
				)
			);
			if (result) {
				fetchStudents();
			}
		} catch (error) {
			console.error("Error assigning subject:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-3xl font-semibold text-richblack-5">
					Assign Subject
				</h3>
				<button
					onClick={() => navigate('/dashboard/admin-subjects')}
					className="flex items-center gap-2 cursor-pointer text-richblack-200 hover:text-richblack-5 transition-all duration-200"
				>
					<FaArrowLeftLong className="text-lg" />
					Back
				</button>
			</div>
			<div className=" w-full h-[60vh] flex items-center flex-wrap justify-center gap-20  ">
				<Link
					to={"/dashboard/admin-subjects/assign-subjects/students"}
					className="bg-medium-gray px-20 py-14 min-w-[20vw] text-center text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Students
				</Link>
				<Link
					to={"/dashboard/admin-subjects/assign-subjects/tutors"}
					className="bg-medium-gray px-20 py-14 min-w-[20vw] text-center text-white font-extrabold text-3xl hover:bg-charcoal-gray transition-all duration-150 rounded-lg hover:scale-[102%] "
				>
					Tutors
				</Link>

			</div>
		</>
	);
}

export default AssignSubjects;
