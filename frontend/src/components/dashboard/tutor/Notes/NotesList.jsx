import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyDetails } from "../../../../services/operations/users.service";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";
import TutorNotesCard from "./TutorNotesCard";
import Modal from "../../extras/Modal";
import { deleteNote } from "../../../../services/operations/notes.service";

function NotesList() {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [myNotes, setMyNotes] = useState(null);
	const [selectedNote, setSelectedNote] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const fetchMyNotes = async () => {
		try {
			const response = await dispatch(getMyDetails(token));
			if (response) {
				// console.log(response?.notes);
				setMyNotes(response?.notes);
			}
		} catch (error) {
			console.log("Error in fetching my notes", error);
			toast.error("Error in fetching my notes");
		}
	};

	const handleDeleteClick = (note) => {
		setSelectedNote(note);
		setShowDeleteModal(true);
	};

	const handleDeleteConfirm = async () => {
		try {
			if (!selectedNote?._id) {
				toast.error("No note selected for deletion");
				setShowDeleteModal(false);
				return;
			}
			await dispatch(deleteNote(selectedNote._id,token));
			await fetchMyNotes();
			setShowDeleteModal(false);
			setSelectedNote(null);
		} catch (error) {
			console.error("Error deleting lecture:", error);
		}
	};

	const handleDeleteCancel = () => {
		setShowDeleteModal(false);
		setSelectedNote(null);
	};

	useEffect(() => {
		fetchMyNotes();
	}, [dispatch, token]);

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">My Notes</h1>
				<div
					onClick={() => navigate(-1)}
					className="flex cursor-pointer gap-2 text-charcoal-gray items-center"
				>
					<IoMdArrowRoundBack />
					Back
				</div>
			</div>
			<div className="p-8">
				{myNotes && myNotes.length === 0 ? (
					<div className="w-full flex items-center justify-center ">
						<p className="text-3xl text-medium-gray">
							No notes available
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{myNotes &&
							myNotes.map((note) => (
								<TutorNotesCard
									key={note._id}
									note={note}
									handleDeleteClick={
										handleDeleteClick
									}
								/>
							))}
					</div>
				)}
			</div>
			{showDeleteModal && (
				<Modal
					title="Delete Lecture"
					description={`Are you sure you want to delete the Note`}
					btn1={{
						text: "Delete",
						onClick: handleDeleteConfirm,
					}}
					btn2={{
						text: "Cancel",
						onClick: handleDeleteCancel,
					}}
				/>
			)}
		</div>
	);
}

export default NotesList;
