import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllSubjects,
	deleteSubject,
} from "../../../../services/operations/subject.service";
import { toast } from "react-hot-toast";
import GetAllSubjects from "./GetAllSubjects";
import SubjectForm from "./SubjectForm";
import AssignSubjects from "./AssignSubjects";

function AdminSubjects() {
	const [clickButton, setClickButton] = useState(null);
	const [subjects, setSubjects] = useState([]);
	const [editingSubject, setEditingSubject] = useState(null);

	const dispatch = useDispatch();
	const { token } = useSelector((state) => state.auth);

	const getAllSubjectsData = async () => {
		try {
			const result = await dispatch(getAllSubjects(token));
			if (result) {
				setSubjects(result);
			}
		} catch (error) {
			console.error("Error fetching subjects:", error);
			toast.error("Failed to fetch subjects");
		}
	};

	useEffect(() => {
		getAllSubjectsData();
	}, []);

	const handleClickedButton = (view) => {
		setClickButton(view);
		setEditingSubject(null);
	};

	const handleEdit = (subject) => {
		setEditingSubject(subject);
		setClickButton("createSubject");
	};

	const handleDelete = async (subjectId) => {
		try {
			const result = await dispatch(deleteSubject(subjectId, token));
			if (result) {
				toast.success("Subject deleted successfully");
				getAllSubjectsData();
			}
		} catch (error) {
			console.error("Error deleting subject:", error);
			toast.error("Failed to delete subject");
		}
	};

	return (
		<div className="w-full mx-auto flex flex-col gap-y-10 p-4">
			{/* First section */}
			<div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-slate-gray flex flex-row items-center justify-evenly min-h-[15vh] text-2xl ">
				<div
					onClick={() => handleClickedButton("createSubject")}
					className={`px-5 py-2 bg-medium-gray rounded-lg cursor-pointer shadow hover:shadow-2xl hover:shadow-slate-gray hover:bg-charcoal-gray transition-all duration-150 h-fit text-white  ${
						clickButton === "createSubject"
							? "bg-charcoal-gray border-4 border-black scale-[101%] "
							: "border-4"
					} `}
				>
					Create Subject
				</div>
				<div
					onClick={() => handleClickedButton("getSubjects")}
					className={`px-5 py-2 bg-medium-gray rounded-lg cursor-pointer shadow hover:shadow-2xl hover:shadow-slate-gray hover:bg-charcoal-gray transition-all duration-150 h-fit text-white  ${
						clickButton === "getSubjects"
							? "bg-charcoal-gray border-4 border-black scale-[101%] "
							: "border-4"
					} `}
				>
					Get All Subjects
				</div>
				<div
					onClick={() => handleClickedButton("assignSubjects")}
					className={`px-5 py-2 bg-medium-gray rounded-lg cursor-pointer shadow hover:shadow-2xl hover:shadow-slate-gray hover:bg-charcoal-gray transition-all duration-150 h-fit text-white  ${
						clickButton === "assignSubjects"
							? "bg-charcoal-gray border-4 border-black scale-[101%] "
							: "border-4"
					} `}
				>
					Assign Subjects
				</div>
			</div>

			{/* Second section */}
			{clickButton === "createSubject" ? (
				<SubjectForm
					setClickButton={setClickButton}
					getAllSubjectsData={getAllSubjectsData}
					editingSubject={editingSubject}
					setEditingSubject={setEditingSubject}
				/>
			) : clickButton === "getSubjects" ? (
				<GetAllSubjects
					subjects={subjects}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
				/>
			) : clickButton === "assignSubjects" ? (
				<AssignSubjects />
			) : (
				<></>
			)}
		</div>
	);
}

export default AdminSubjects;
