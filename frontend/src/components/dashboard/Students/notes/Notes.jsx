import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllNotes } from "../../../../services/operations/notes.service";
import NotesCard from "./NotesCard";
import { getAllSubjects } from "../../../../services/operations/subject.service";
import toast from "react-hot-toast";

function Notes() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [allNotes, setAllNotes] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [selectedSub, setSelectedSub] = useState("all");

	useEffect(() => {
		const fetchAllSubjects = async () => {
			try {
				const response = await dispatch(getAllSubjects(token));
				if (response) {
					// console.log(response);
					setSubjects(response);
				}
			} catch (error) {
				toast.error("Error in fetching subjects");
				console.error("Error fetching subjects:", error);
			}
		};
		fetchAllSubjects();
	}, [dispatch, token]);

	useEffect(() => {
		const fetchAllNotes = async () => {
			try {
				let result = await dispatch(getAllNotes(token));
				if (result) {
					// console.log("RESULT : ", result);
					if (selectedSub === "all") {
						setAllNotes(result);
					} else {
						result = result.filter(
							(item) => item.subject._id === selectedSub
						);
						setAllNotes(result);
					}
				}
			} catch (error) {
				toast.error("Error in fetching notes");
				console.error("Error fetching notes:", error);
			}
		};

		fetchAllNotes();
	}, [dispatch, token, selectedSub]);

	return (
		<div className="container mx-auto p-4">
			<div className="flex w-full justify-between pb-7 ">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Notes
				</h1>
				<select
					className="border h-fit mt-5 px-2 py-1 rounded-md border-slate-gray"
					name="subjects"
					id="subjects"
					onChange={(e) => setSelectedSub(e.target.value)}
				>
					<option value="all">All Subjects</option>
					{subjects &&
						subjects.map((sub) => (
							<option key={sub._id} value={sub._id}>
								{sub.name}
							</option>
						))}
				</select>
			</div>
			{allNotes.length === 0 ? (
				<div className="w-full flex items-center justify-center ">
					<p className="text-3xl text-medium-gray">
						No notes available
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{allNotes.map((note) => (
						<NotesCard key={note._id} note={note} />
					))}
				</div>
			)}
		</div>
	);
}

export default Notes;
